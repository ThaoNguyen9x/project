import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  message,
  notification,
  Tooltip,
} from "antd";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteWorkRegistration,
  callGetAllWorkRegistrations,
  callGetAllUsers,
  callGetWorkRegistration,
} from "../../services/api";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_DATE_DISPLAY, FORMAT_TEXT_LENGTH } from "../../utils/constant";
import Highlighter from "react-highlight-words";
import { AuthContext } from "../../components/share/Context";
import dayjs from "dayjs";
import ModalWorkRegistration from "../../components/admin/Work_Registration/modal.work-registration";
import ViewWorkRegistration from "../../components/admin/Work_Registration/view.work-registration";
import { useLocation, useNavigate } from "react-router-dom";

const WorkRegistration = () => {
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
  const [dataView, setDataView] = useState(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setCurrent(1);
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
      fixed: "left",
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registrationDate",
      sorter: (a, b) => a.registrationDate.localeCompare(b.registrationDate),
      ...getColumnSearchProps("registrationDate"),
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetWorkRegistration(record?.registrationID);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "registrationDate" ? (
              <HighlightText
                text={record?.registrationDate}
                searchText={searchText}
              />
            ) : (
              dayjs(record?.registrationDate).format(FORMAT_DATE_DISPLAY)
            )}
          </a>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      sorter: (a, b) => {
        const noteA = a.note || "";
        const noteB = b.note || "";
        return noteA.localeCompare(noteB);
      },
      ...getColumnSearchProps("note"),
      render: (text, record) => {
        const note = record.note || "N/A";
        return searchedColumn === "note" ? (
          <HighlightText text={note} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(note, 20)
        );
      },
    },
    {
      title: "Ngày dự kiến",
      dataIndex: "scheduledDate",
      sorter: (a, b) => a.scheduledDate.localeCompare(b.scheduledDate),
      ...getColumnSearchProps("scheduledDate"),
      render: (text, record) =>
        dayjs(record?.scheduledDate).format(FORMAT_DATE_DISPLAY) || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Đang chờ xử lý",
          value: "PENDING",
        },
        {
          text: "Đã chấp nhận",
          value: "APPROVED",
        },
        {
          text: "Đã từ chối",
          value: "REJECTED",
        },
        {
          text: "Đã hoàn thành",
          value: "COMPLETED",
        },
      ],
      onFilter: (value, record) => record?.status === value,
      render: (status, record) => (
        <span
          className={`${
            record.status === "PENDING"
              ? "warning"
              : record.status === "REJECTED"
              ? "danger"
              : record.status === "COMPLETED"
              ? "success"
              : "success"
          } status`}
        >
          {record.status === "PENDING"
            ? "Đang chờ xử lý"
            : record.status === "APPROVED"
            ? "Đã chấp nhận"
            : record.status === "COMPLETED"
            ? "Đã hoàn thành"
            : "Đã từ chối"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          {user?.role?.name === "Technician_Manager" &&
          record?.status !== "PENDING" ? (
            ""
          ) : (
            <Access
              permission={ALL_PERMISSIONS.WORK_REGISTRATIONS.UPDATE}
              hideChildren
            >
              <Tooltip placement="bottom" title="Chỉnh sửa">
                <div
                  onClick={async () => {
                    const res = await callGetWorkRegistration(
                      record?.registrationID
                    );
                    if (res?.data) {
                      setData(res?.data);
                      setOpenModal(true);
                    }
                  }}
                  className="cursor-pointer text-amber-900"
                >
                  <CiEdit className="h-5 w-5" />
                </div>
              </Tooltip>
            </Access>
          )}
          <Access
            permission={ALL_PERMISSIONS.WORK_REGISTRATIONS.DELETE}
            hideChildren
          >
            <Tooltip placement="bottom" title="Xóa">
              <Popconfirm
                placement="leftBottom"
                okText="Có"
                cancelText="Không"
                title="Xác nhận"
                description="Bạn có chắc chắn muốn xóa không?"
                onConfirm={() => handleDelete(record.registrationID)}
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
            </Tooltip>
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
      query += `&sort=${sortQuery}`;
    } else {
      query += `&sort=updatedAt,desc`;
    }

    const res = await callGetAllWorkRegistrations(query);
    if (res && res.data) {
      let data = res.data.result;

      data = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setList(data);
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  const onChange = (pagination, filters, sorter) => {
    if (pagination) {
      if (pagination.current !== current) {
        setCurrent(pagination.current);
      }

      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
        setCurrent(1);
      }
    }

    if (sorter && sorter.field) {
      const sortField = sorter.field;
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      setSortQuery(`${sortField},${sortOrder}`);
    } else {
      setSortQuery("");
    }
  };

  const handleDelete = async (registrationID) => {
    const res = await callDeleteWorkRegistration(registrationID);

    if (res && res.statusCode === 200) {
      message.success(res.message);
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    if (id) {
      fetchData();

      const fetchRequest = async () => {
        const res = await callGetWorkRegistration(id);
        if (res?.data) {
          setDataView(res?.data);
          setOpenViewDetail(true);

          navigate(location.pathname, { replace: true });
        }
      };
      fetchRequest();
    }
  }, [location.search, navigate]);

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Đăng ký thi công</h2>
        <Access
          permission={ALL_PERMISSIONS.WORK_REGISTRATIONS.CREATE}
          hideChildren
        >
          <Tooltip placement="bottom" title="Thêm">
            <Button
              onClick={() => setOpenModal(true)}
              className="p-2 xl:p-3 gap-1 xl:gap-2"
            >
              <GoPlus className="h-4 w-4" />
            </Button>
          </Tooltip>
        </Access>
      </div>
      <div className="relative overflow-x-auto">
        <Table
          rowKey={(record) => record.registrationID}
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

        <ViewWorkRegistration
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalWorkRegistration
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default WorkRegistration;
