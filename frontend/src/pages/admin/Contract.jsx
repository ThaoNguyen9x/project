import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  message,
  notification,
  Modal,
} from "antd";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteContract,
  callGetAllContracts,
  callGetAllCustomers,
  callGetAllOffices,
} from "../../services/api";

import ModalContract from "../../components/admin/Customer_Service/Contract/modal.contract";
import ViewContract from "../../components/admin/Customer_Service/Contract/view.contract";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import PDFViewer from "../../components/share/PDFViewer";
import Highlighter from "react-highlight-words";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import HighlightText from "../../components/share/HighlightText";
import { AuthContext } from "../../components/share/Context";

const Contract = () => {
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [listCustomers, setListCustomers] = useState([]);
  const [listOffices, setListOffices] = useState([]);

  useEffect(() => {
    const init = async () => {
      const customer = await callGetAllCustomers();
      if (customer && customer.data) {
        setListCustomers(customer.data?.result);
      }

      const office = await callGetAllOffices();
      if (office && office.data) {
        setListOffices(office.data?.result);
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
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      ...getColumnSearchProps("startDate"),
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setData(record);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "startDate" ? (
              <HighlightText text={record?.startDate} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(record?.startDate)
            )}
          </a>
        );
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      ...getColumnSearchProps("endDate"),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      sorter: (a, b) =>
        a.customer.companyName.localeCompare(b.customer.companyName),
      ...getColumnSearchProps("customer.companyName"),
      render: (customer) => {
        return (
          <a
            onClick={() => {
              setData(customer);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "customer.companyName" ? (
              <HighlightText
                text={customer?.companyName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(customer?.companyName)
            )}
          </a>
        );
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      ...getColumnSearchProps("totalAmount"),
      render: (text, record) => {
        const formatted =
          record?.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "N/A";

        return searchedColumn === "totalAmount" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "File",
      dataIndex: "fileName",
      render: (text, record) => {
        return record.fileName ? (
          <a
            onClick={() => {
              setPdfUrl(
                `${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
                  record?.fileName
                }`
              );
              setPreviewOpen(true);
            }}
          >
            View
          </a>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "leaseStatus",
      filters: [
        {
          text: "Hoạt động",
          value: "Active",
        },
        {
          text: "Đã chấm dứt",
          value: "Inactive",
        },
        {
          text: "Đang chờ gia hạn",
          value: "Pending",
        },
      ],
      onFilter: (value, record) => record?.leaseStatus === value,
      render: (leaseStatus, record) => (
        <span
          className={`${
            leaseStatus === "Active"
              ? "success"
              : leaseStatus === "Inactive"
              ? "danger"
              : "warning"
          } status`}
        >
          {leaseStatus === "Active"
            ? "Hoạt động"
            : leaseStatus === "Inactive"
            ? "Đã chấm dứt"
            : "Đang chờ gia hạn"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access permission={ALL_PERMISSIONS.CONTRACTS.UPDATE} hideChildren>
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
          <Access permission={ALL_PERMISSIONS.CONTRACTS.DELETE} hideChildren>
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

    const res = await callGetAllContracts(query);
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
    const res = await callDeleteContract(id);

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
        <h2 className="text-base xl:text-xl font-bold">Hợp đồng</h2>
        <Access permission={ALL_PERMISSIONS.CONTRACTS.CREATE} hideChildren>
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

        <ViewContract
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalContract
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listCustomers={listCustomers}
          listOffices={listOffices}
        />

        <Modal
          title="PDF"
          open={previewOpen}
          onCancel={() => {
            setPreviewOpen(false);
            setPdfUrl();
          }}
          footer={null}
          width={800}
          styles={{ body: { height: "600px" } }}
          style={{
            top: 20,
          }}
        >
          <PDFViewer fileUrl={pdfUrl} />
        </Modal>
      </div>
    </div>
  );
};

export default Contract;
