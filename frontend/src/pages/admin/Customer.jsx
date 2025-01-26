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
import Highlighter from "react-highlight-words";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteCustomer,
  callGetAllCustomerTypes,
  callGetAllCustomers,
  callGetAllUsers,
  callGetAllUsersUsed,
} from "../../services/api";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ModalCustomer from "../../components/admin/customer_service/Customer/modal.customer";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";
import ViewCustomer from "../../components/admin/Customer_Service/Customer/view.customer";

const Customer = () => {
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
  const [listUsers, setListUsers] = useState([]);
  const [listUsersUsed, setListUsersUsed] = useState([]);

  useEffect(() => {
    const init = async () => {
      const customerTypes = await callGetAllCustomerTypes();
      if (customerTypes && customerTypes.data) {
        setListCustomerTypes(customerTypes.data?.result);
      }

      const users = await callGetAllUsers();
      if (users && users.data) {
        setListUsers(users.data?.result);
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
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Công ty",
      dataIndex: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      ...getColumnSearchProps("companyName"),
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setData(record);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "companyName" ? (
              <HighlightText
                text={record?.companyName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(record?.companyName)
            )}
          </a>
        );
      },
    },
    {
      title: "Giám đốc",
      dataIndex: "directorName",
      sorter: (a, b) => a.directorName.localeCompare(b.directorName),
      ...getColumnSearchProps("directorName"),
      render: (text, record) => {
        return searchedColumn === "directorName" ? (
          <HighlightText text={record?.directorName} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(record?.directorName)
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps("email"),
      render: (text, record) => {
        return searchedColumn === "email" ? (
          <HighlightText text={record?.email} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(record?.email)
        );
      },
    },
    {
      title: "Liên hệ",
      dataIndex: "user",
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
      ...getColumnSearchProps("user.name"),
      render: (user) => {
        return (
          <a
            onClick={() => {
              setData(user);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "user.name" ? (
              <HighlightText text={user?.name} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(user?.name)
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
          value: "ACTIV",
        },
        {
          text: "Không hoạt động",
          value: "UNACTIV",
        },
      ],
      onFilter: (value, record) => record?.status === value,
      render: (status, record) => (
        <span className={`${status === "ACTIV" ? "success" : "danger"} status`}>
          {status === "ACTIV" ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access permission={ALL_PERMISSIONS.CUSTOMERS.UPDATE} hideChildren>
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
          <Access permission={ALL_PERMISSIONS.CUSTOMERS.DELETE} hideChildren>
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

    const res = await callGetAllCustomers(query);
    if (res && res.data) {
      setList(
        res.data.result.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      setTotal(res.data.meta.total);
    }

    const usersUsed = await callGetAllUsersUsed();
    if (usersUsed && usersUsed.data) {
      setListUsersUsed(usersUsed.data?.result);
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
    const res = await callDeleteCustomer(id);

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
        <h2 className="text-base xl:text-xl font-bold">Khách hàng</h2>
        <Access permission={ALL_PERMISSIONS.CUSTOMERS.CREATE} hideChildren>
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

        <ViewCustomer
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalCustomer
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listCustomerTypes={listCustomerTypes}
          listUsers={listUsers}
          listUsersUsed={listUsersUsed}
        />
      </div>
    </div>
  );
};

export default Customer;
