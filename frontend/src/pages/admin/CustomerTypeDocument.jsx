import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  message,
  notification,
} from "antd";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ModalCustomerTypeDocument from "../../components/admin/Customer_Service/Customer_Type_Document/modal.customer-type-document";
import ViewCustomerTypeDocument from "../../components/admin/Customer_Service/Customer_Type_Document/view.customer-type-document";
import {
  callDeleteCustomerTypeDocument,
  callGetAllCustomerTypeDocuments,
  callGetAllCustomerTypes,
} from "../../services/api";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import HighlightText from "../../components/share/HighlightText";
import Highlighter from "react-highlight-words";
import { AuthContext } from "../../components/share/Context";

const CustomerTypeDocument = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortQuery, setSortQuery] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);

  const [listCustomerTypes, setListCustomerTypes] = useState([]);

  useEffect(() => {
    const init = async () => {
      const customerTypes = await callGetAllCustomerTypes();
      if (customerTypes && customerTypes.data) {
        setListCustomerTypes(customerTypes.data?.result);
      }
    };
    init();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="block mb-2"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<IoSearchOutline />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <IoSearchOutline
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const keys = dataIndex.split(".");
      let recordValue = record;

      keys.forEach((key) => {
        if (recordValue) {
          recordValue = recordValue[key];
        }
      });

      return (
        recordValue &&
        recordValue.toString().toLowerCase().includes(value.toLowerCase())
      );
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => {
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      );
    },
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      fixed: 'left',
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Loại tài liệu",
      dataIndex: "documentType",
      sorter: (a, b) => a.documentType.localeCompare(b.documentType),
      ...getColumnSearchProps("documentType"),
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setData(record);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "documentType" ? (
              <HighlightText
                text={record?.documentType}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(record?.documentType)
            )}
          </a>
        );
      },
    },
    {
      title: "Loại khách hàng",
      dataIndex: "customerType",
      sorter: (a, b) =>
        a.customerType.typeName.localeCompare(b.customerType.typeName),
      ...getColumnSearchProps("customerType.typeName"),
      render: (customerType) => {
        return (
          <a
            onClick={() => {
              setData(customerType);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "customerType.typeName" ? (
              <HighlightText
                text={customerType?.typeName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(customerType?.typeName)
            )}
          </a>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Hoạt động",
          value: true,
        },
        {
          text: "Không hoạt động",
          value: false,
        },
      ],
      onFilter: (value, record) => record?.status === value,
      render: (status, record) => (
        <span className={`${status ? "success" : "danger"} status`}>
          {status ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access
            permission={ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.UPDATE}
            hideChildren
          >
            <div
              onClick={() => {
                setData(record);
                setOpenModal(true);
              }}
              className="cursor-pointer text-amber-900"
            >
              <CiEdit className="h-5 w-5" />
            </div>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.DELETE}
            hideChildren
          >
            <Popconfirm
              placement="leftBottom"
              okText="Có"
              cancelText="Không"
              title="Xác nhận"
              description="Bạn có chắc chắn muốn xóa không?"
              onConfirm={() => handleDelete(record.id)}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              className="cursor-pointer DELETE"
            >
              <>
                <AiOutlineDelete className="h-5 w-5" />
              </>
            </Popconfirm>
          </Access>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [searchedColumn, searchText, current, pageSize, sortQuery]);

  const fetchData = async () => {
    setIsLoading(true);

    let query = `page=${current}&size=${pageSize}`;

    if (searchText && searchedColumn) {
      query += `&filter=${searchedColumn}~'${searchText}'`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callGetAllCustomerTypeDocuments(query);
    if (res && res.data) {
      setList(
        res.data.result.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  const onChange = (pagination, filters, sorter) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const sortField = sorter.field;
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      const q = `sort=${sortField},${sortOrder}`;
      setSortQuery(q);
    } else {
      setSortQuery("");
    }
  };

  const handleDelete = async (id) => {
    const res = await callDeleteCustomerTypeDocument(id);

    if (res && res && res.statusCode === 200) {
      message.success(res.message);
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }
  };

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Hồ sơ phân loại</h2>
        <Access
          permission={ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.CREATE}
          hideChildren
        >
          <Button onClick={() => setOpenModal(true)} className="p-2 xl:p-3 gap-1 xl:gap-2">
            <GoPlus className="h-4 w-4" />
            Thêm
          </Button>
        </Access>
      </div>
      <div className="relative overflow-x-auto">
        <Table
          rowKey={(record) => record.id}
          loading={isLoading}
          columns={columns}
          dataSource={list}
          onChange={onChange}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />

        <ViewCustomerTypeDocument
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalCustomerTypeDocument
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listCustomerTypes={listCustomerTypes}
        />
      </div>
    </div>
  );
};

export default CustomerTypeDocument;
