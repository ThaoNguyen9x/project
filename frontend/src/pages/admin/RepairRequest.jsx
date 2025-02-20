import dayjs from "dayjs";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
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
  callDeleteRepairRequest,
  callGetAllRepairRequests,
  callGetAllUsers,
  callGetRepairRequest,
} from "../../services/api";

import ModalRepairRequest from "../../components/admin/Repair_Request/modal.repair-request";
import ViewRepairRequest from "../../components/admin/Repair_Request/view.repair-request";

import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import { FORMAT_DATE_DISPLAY, FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";
import Access from "../../components/share/Access";
import HighlightText from "../../components/share/HighlightText";

const RepairRequest = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
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

  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllUsers();
      if (res && res.data) {
        setListUsers(res.data?.result);
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
      fixed: "left",
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Ngày thi công",
      dataIndex: "requestDate",
      sorter: (a, b) => a.requestDate.localeCompare(b.requestDate),
      ...getColumnSearchProps("requestDate"),
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetRepairRequest(record?.requestID);
              if (res?.data) {
                setData(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "requestDate" ? (
              <HighlightText
                text={record?.requestDate}
                searchText={searchText}
              />
            ) : (
              dayjs(record?.requestDate).format(FORMAT_DATE_DISPLAY)
            )}
          </a>
        );
      },
    },
    {
      title: "Nội dụng",
      dataIndex: "content",
      sorter: (a, b) => {
        const contentA = a.content || "";
        const contentB = b.content || "";
        return contentA.localeCompare(contentB);
      },
      ...getColumnSearchProps("content"),
      render: (text, record) => {
        const content = record.content || "N/A";
        return searchedColumn === "content" ? (
          <HighlightText text={content} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(content, 20)
        );
      },
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
          text: "Đã hoàn thành",
          value: "SUCCESS",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <span
          className={`${status == "PENDING" ? "warning" : "success"} status`}
        >
          {status == "PENDING" ? "Đang chờ xử lý" : "Đã hoàn thành"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access
            permission={ALL_PERMISSIONS.REPAIR_REQUEST.UPDATE}
            hideChildren
          >
            <div
              onClick={async () => {
                const res = await callGetRepairRequest(record?.requestID);
                if (res?.data) {
                  setData(res?.data);
                  setOpenModal(true);
                }
              }}
              className="cursor-pointer text-amber-900"
            >
              <CiEdit className="h-5 w-5" />
            </div>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.REPAIR_REQUEST.DELETE}
            hideChildren
          >
            <Popconfirm
              placement="leftBottom"
              okText="Có"
              cancelText="Không"
              title="Xác nhận"
              description="Bạn có chắc chắn muốn xóa không?"
              onConfirm={() => handleDelete(record.requestID)}
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

    const res = await callGetAllRepairRequests(query);
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

  const handleDelete = async (requestID) => {
    const res = await callDeleteRepairRequest(requestID);

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const requestID = queryParams.get("requestID");

    if (requestID) {
      const fetchRequest = async () => {
        const res = await callGetAllRepairRequests(
          `filter=requestID~'${requestID}'`
        );
        if (res?.data?.result.length) {
          setData(res.data.result[0]);
          setOpenViewDetail(true);
        }
      };
      fetchRequest();
    }
  }, [location.search]);

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Yêu cầu sửa chữa</h2>
        <Access permission={ALL_PERMISSIONS.REPAIR_REQUEST.CREATE} hideChildren>
          <Button
            onClick={() => setOpenModal(true)}
            className="p-2 xl:p-3 gap-1 xl:gap-2"
          >
            <GoPlus className="h-4 w-4" />
            Thêm
          </Button>
        </Access>
      </div>
      <div className="relative overflow-x-auto">
        <Table
          rowKey={(record) => record.requestID}
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

        <ViewRepairRequest
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalRepairRequest
          user={user}
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listUsers={listUsers}
        />
      </div>
    </div>
  );
};

export default RepairRequest;
