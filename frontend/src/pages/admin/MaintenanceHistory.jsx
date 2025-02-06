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
import {
  callDeleteMaintenanceHistory,
  callGetAllMaintenanceHistories,
  callGetAllSystemMaintenanceServices,
  callGetAllUsers,
} from "../../services/api";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ViewMaintenanceHistory from "../../components/admin/Property_Manager/Maintenance_History/view.maintenance-history";
import ModalMaintenanceHistory from "../../components/admin/Property_Manager/Maintenance_History/modal.maintenance-history";
import Highlighter from "react-highlight-words";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";

const MaintenanceHistory = () => {
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

  const [listSystemMaintenanceServices, setListSystemMaintenanceServices] =
    useState([]);
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const systemMaintenanceService =
        await callGetAllSystemMaintenanceServices();
      if (systemMaintenanceService && systemMaintenanceService.data) {
        setListSystemMaintenanceServices(systemMaintenanceService.data?.result);
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
      fixed: 'left',
      render: (text, record, index) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Ngày thực hiện",
      dataIndex: "performedDate",
      sorter: (a, b) => new Date(a.performedDate) - new Date(b.performedDate),
      ...getColumnSearchProps("performedDate"),
      render: (text, record, index) => {
        return (
          <a
            onClick={() => {
              setData(record);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "performedDate" ? (
              <HighlightText
                text={record?.performedDate}
                searchText={searchText}
              />
            ) : (
              record?.performedDate
            )}
          </a>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      sorter: (a, b) => a.notes.localeCompare(b.notes),
      ...getColumnSearchProps("notes"),
    },
    {
      title: "Dịch vụ bảo trì",
      dataIndex: "maintenanceService",
      sorter: (a, b) =>
        a.maintenanceService.serviceType.localeCompare(
          b.maintenanceService.serviceType
        ),
      ...getColumnSearchProps("maintenanceService.serviceType"),
      render: (text, record) => {
        const subcontractorName =
          record?.maintenanceService?.subcontractor?.name || "N/A";
        const serviceType = record?.maintenanceService?.serviceType;
        let translatedServiceType = "N/A";

        if (serviceType === "ELECTRICAL") {
          translatedServiceType = "Hệ thống điện";
        } else if (serviceType === "PLUMBING") {
          translatedServiceType = "Hệ thống cấp thoát nước";
        } else if (serviceType === "HVAC") {
          translatedServiceType = "Hệ thống điều hòa không khí";
        } else if (serviceType) {
          translatedServiceType = "Hệ thống phòng cháy";
        }

        return `${subcontractorName} - ${translatedServiceType}`;
      },
    },
    {
      title: "Kỹ thuật viên",
      dataIndex: "technician",
      sorter: (a, b) => a.technician.name.localeCompare(b.technician.name),
      ...getColumnSearchProps("technician.name"),
      render: (technician) => {
        return (
          <a
            onClick={() => {
              setData(technician);
              setOpenViewDetail(true);
            }}
          >
            {searchedColumn === "technician.name" ? (
              <HighlightText text={technician?.name} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(technician?.name, 20)
            )}
          </a>
        );
      },
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

    const res = await callGetAllMaintenanceHistories(query);
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
    const res = await callDeleteMaintenanceHistory(id);

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
        <h2 className="text-base xl:text-xl font-bold">Lịch sử bảo trì</h2>
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

        <ViewMaintenanceHistory
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalMaintenanceHistory
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listSystemMaintenanceServices={listSystemMaintenanceServices}
          listUsers={listUsers}
        />
      </div>
    </div>
  );
};

export default MaintenanceHistory;
