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
  callDeletePermission,
  callGetAllPermissions,
  callGetPermission,
} from "../../services/api";

import ModalPermission from "../../components/admin/Access_Control/Permission/modal.permission";
import ViewPermission from "../../components/admin/Access_Control/Permission/view.permission";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";
import Highlighter from "react-highlight-words";

const Permission = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortQuery, setSortQuery] = useState("");
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
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
      render: (text, record, index) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetPermission(record?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "name" ? (
              <HighlightText text={record?.name} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(record?.name, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Path",
      dataIndex: "apiPath",
      sorter: (a, b) => a.apiPath.localeCompare(b.apiPath),
      ...getColumnSearchProps("apiPath"),
      render: (text, record) => {
        return searchedColumn === "apiPath" ? (
          <HighlightText text={record?.apiPath} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(record?.apiPath, 20)
        );
      },
    },
    {
      title: "Method",
      dataIndex: "method",
      sorter: (a, b) => a.method.localeCompare(b.method),
      ...getColumnSearchProps("method"),
      render: (text, record) => {
        const methodColor = {
          GET: "GET",
          POST: "POST",
          PUT: "PUT",
          DELETE: "DELETE",
        };

        const methodClass = methodColor[record.method] || "text-purple-700";

        const renderedText =
          searchedColumn === "method" ? (
            <HighlightText text={record?.method} searchText={searchText} />
          ) : (
            record?.method
          );

        return <p className={`font-bold ${methodClass}`}>{renderedText}</p>;
      },
    },
    {
      title: "Module",
      dataIndex: "module",
      sorter: (a, b) => a.module.localeCompare(b.module),
      ...getColumnSearchProps("module"),
      render: (text, record) => {
        return searchedColumn === "module" ? (
          <HighlightText text={record?.module} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(record?.module, 20)
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: (a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1),
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
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <Tooltip placement="bottom" title="Chỉnh sửa">
              <div
                onClick={async () => {
                  const res = await callGetPermission(record?.id);
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
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Tooltip placement="bottom" title="Xóa">
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

    const res = await callGetAllPermissions(query);
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

  const handleDelete = async (id) => {
    const res = await callDeletePermission(id);

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

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Quyền hạn</h2>
        <Access permission={ALL_PERMISSIONS.PERMISSIONS.CREATE} hideChildren>
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

        <ViewPermission
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalPermission
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

export default Permission;
