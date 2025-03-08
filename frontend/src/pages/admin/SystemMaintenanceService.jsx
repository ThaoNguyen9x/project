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
  callDeleteSystemMaintenanceService,
  callGetAllSystemMaintenanceServices,
  callGetAllSubcontracts,
  callGetSystemMaintenanceService,
  callGetSubcontract,
} from "../../services/api";

import ModalSystemMaintenanceService from "../../components/admin/Property_Manager/System_Maintenance_Service/modal.system-maintenance-service";
import ViewSystemMaintenanceService from "../../components/admin/Property_Manager/System_Maintenance_Service/view.system-maintenance-service";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import Highlighter from "react-highlight-words";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";

const SystemMaintenanceService = () => {
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

  const [listSubcontractors, setListSubcontractors] = useState([]);

  useEffect(() => {
    const init = async () => {
      const system = await callGetAllSubcontracts(`page=1&size=100`);
      if (system && system.data) {
        setListSubcontractors(system.data?.result);
      }
    };
    init();
  }, []);

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
      title: "Dịch vụ",
      dataIndex: "serviceType",
      filters: [
        {
          text: "Hệ thống Điện",
          value: "ELECTRICAL",
        },
        {
          text: "Hệ thống Cấp thoát nước",
          value: "PLUMBING",
        },
        {
          text: "Hệ thống Phòng cháy",
          value: "FIRE_PROTECTION",
        },
        {
          text: "Hệ thống Điều hòa không khí",
          value: "HVAC",
        },
      ],
      onFilter: (value, record) => record?.serviceType === value,
      render: (serviceType, record) => {
        const serviceNames = {
          ELECTRICAL: "Hệ thống Điện",
          PLUMBING: "Hệ thống Cấp thoát nước",
          FIRE_PROTECTION: "Hệ thống Phòng cháy",
          HVAC: "Hệ thống Điều hòa không khí",
        };

        const serviceName = serviceNames[record?.serviceType] || "N/A";

        return (
          <a
            onClick={async () => {
              const res = await callGetSystemMaintenanceService(record?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "serviceType" ? (
              <HighlightText text={serviceName} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(serviceName, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Ngày dự kiến",
      dataIndex: "nextScheduledDate",
      sorter: (a, b) =>
        new Date(a.nextScheduledDate) - new Date(b.nextScheduledDate),
      ...getColumnSearchProps("nextScheduledDate"),
    },
    {
      title: "Nhà thầu phụ",
      dataIndex: "subcontractor",
      sorter: (a, b) =>
        a.subcontractor.name.localeCompare(b.subcontractor.name),
      ...getColumnSearchProps("subcontractor.name"),
      render: (subcontractor) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetSubcontract(subcontractor?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "subcontractor.name" ? (
              <HighlightText
                text={subcontractor?.name}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(subcontractor?.name, 20)
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
          text: "Chưa giải quyết",
          value: "PENDING",
        },
        {
          text: "Đang tiến hành",
          value: "IN_PROGRESS",
        },
        {
          text: "Hoàn thành",
          value: "COMPLETED",
        },
      ],
      onFilter: (value, record) => record?.status === value,
      render: (status, record) => (
        <span
          className={`${
            status === "COMPLETED"
              ? "success"
              : status === "PENDING"
              ? "danger"
              : "warning"
          } status`}
        >
          {status === "COMPLETED"
            ? "Hoàn thành"
            : status === "PENDING"
            ? "Chưa giải quyết"
            : "Đang tiến hành"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access
            permission={ALL_PERMISSIONS.SYSTEM_MAINTENANCE_SERVICES.UPDATE}
            hideChildren
          >
            <div
              onClick={async () => {
                const res = await callGetSystemMaintenanceService(record?.id);
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
            permission={ALL_PERMISSIONS.SYSTEM_MAINTENANCE_SERVICES.DELETE}
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
      query += `&sort=${sortQuery}`;
    } else {
      query += `&sort=updatedAt,desc`;
    }

    const res = await callGetAllSystemMaintenanceServices(query);
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
    const res = await callDeleteSystemMaintenanceService(id);

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
        <h2 className="text-base xl:text-xl font-bold">
          Dịch vụ bảo trì hệ thống
        </h2>
        <div className="flex items-center gap-2">
          <Access
            permission={ALL_PERMISSIONS.SYSTEM_MAINTENANCE_SERVICES.CREATE}
            hideChildren
          >
            <Button
              onClick={() => setOpenModal(true)}
              className="p-2 xl:p-3 gap-1 xl:gap-2"
            >
              <GoPlus className="h-4 w-4" />
              Thêm
            </Button>
          </Access>
        </div>
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

        <ViewSystemMaintenanceService
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalSystemMaintenanceService
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listSubcontractors={listSubcontractors}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default SystemMaintenanceService;
