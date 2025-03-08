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
  callDeleteDevice,
  callGetAllDevices,
  callGetAllDeviceTypes,
  callGetAllLocations,
  callGetAllSystemMaintenanceServices,
  callGetAllSystems,
  callGetDevice,
  callGetDeviceType,
  callGetSystem,
} from "../../services/api";

import ModalDevice from "../../components/admin/Property_Manager/Device/modal.device";
import ViewDevice from "../../components/admin/Property_Manager/Device/view.device";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import Highlighter from "react-highlight-words";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";

const Device = () => {
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
  const [openModalDevice, setOpenModalDevice] = useState(false);
  const [data, setData] = useState(null);
  const [dataView, setDataView] = useState(null);

  const [listSystems, setListSystems] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listDeviceTypes, setListDeviceTypes] = useState([]);
  const [listSystemMaintenanceServices, setListSystemMaintenanceServices] =
    useState([]);

  useEffect(() => {
    const init = async () => {
      const systems = await callGetAllSystems(`page=1&size=100`);
      if (systems && systems.data) {
        setListSystems(systems.data?.result);
      }

      const locations = await callGetAllLocations(`page=1&size=100`);
      if (locations && locations.data) {
        setListLocations(locations.data?.result);
      }

      const deviceTypes = await callGetAllDeviceTypes(`page=1&size=100`);
      if (deviceTypes && deviceTypes.data) {
        setListDeviceTypes(deviceTypes.data?.result);
      }

      const systemMaintenanceServices =
        await callGetAllSystemMaintenanceServices(`page=1&size=100`);
      if (systemMaintenanceServices && systemMaintenanceServices.data) {
        setListSystemMaintenanceServices(
          systemMaintenanceServices.data?.result
        );
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
      title: "Tên thiết bị",
      dataIndex: "deviceName",
      sorter: (a, b) => a.deviceName.localeCompare(b.deviceName),
      ...getColumnSearchProps("deviceName"),
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetDevice(record?.deviceId);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "deviceName" ? (
              <HighlightText
                text={record?.deviceName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(record?.deviceName, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Loại thiết bị",
      dataIndex: "deviceType",
      sorter: (a, b) =>
        a.deviceType.typeName.localeCompare(b.deviceType.typeName),
      ...getColumnSearchProps("deviceType.typeName"),
      render: (deviceType) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetDeviceType(deviceType?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "deviceType.typeName" ? (
              <HighlightText
                text={deviceType?.typeName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(deviceType?.typeName, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Ngày cài đặt",
      dataIndex: "installationDate",
      sorter: (a, b) =>
        new Date(a.installationDate) - new Date(b.installationDate),
      ...getColumnSearchProps("installationDate"),
    },
    {
      title: "Tuổi thọ",
      dataIndex: "lifespan",
      sorter: (a, b) => a.lifespan - b.lifespan,
      ...getColumnSearchProps("lifespan"),
    },
    {
      title: "Hệ thống",
      dataIndex: "system",
      sorter: (a, b) => a.system.systemName.localeCompare(b.system.systemName),
      ...getColumnSearchProps("system.systemName"),
      render: (system) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetSystem(system?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "system.systemName" ? (
              <HighlightText
                text={system?.systemName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(system?.systemName, 20)
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
          value: "ACTIVE",
        },
        {
          text: "Đang bảo trì",
          value: "UNDER_MAINTENANCE",
        },
        {
          text: "Lỗi",
          value: "FAULTY",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <span
          className={`${
            status == "ACTIVE"
              ? "success"
              : status == "FAULTY"
              ? "danger"
              : "warning"
          } status`}
        >
          {status == "ACTIVE"
            ? "Hoạt động"
            : status == "FAULTY"
            ? "Lỗi"
            : "Đang bảo trì"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access permission={ALL_PERMISSIONS.DEVICES.UPDATE} hideChildren>
            <Tooltip placement="bottom" title="Chỉnh sửa">
              <div
                onClick={async () => {
                  const res = await callGetDevice(record?.deviceId);
                  if (res?.data) {
                    setData(res?.data);
                    setOpenModalDevice(true);
                  }
                }}
                className="cursor-pointer text-amber-900"
              >
                <CiEdit className="h-5 w-5" />
              </div>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.DEVICES.DELETE} hideChildren>
            <Tooltip placement="bottom" title="Xóa">
              <Popconfirm
                placement="leftBottom"
                okText="Có"
                cancelText="Không"
                title="Xác nhận"
                description="Bạn có chắc chắn muốn xóa không?"
                onConfirm={() => handleDelete(record.deviceId)}
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

    const res = await callGetAllDevices(query);
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

  const handleDelete = async (deviceId) => {
    const res = await callDeleteDevice(deviceId);

    if (res && res.statusCode === 200) {
      message.success(res.message);
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Thiết bị đang được sử dụng không thể xóa",
      });
    }
  };

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Thiết bị</h2>
        <Access permission={ALL_PERMISSIONS.DEVICES.CREATE} hideChildren>
          <Tooltip placement="bottom" title="Thêm">
            <Button
              onClick={() => setOpenModalDevice(true)}
              className="p-2 xl:p-3 gap-1 xl:gap-2"
            >
              <GoPlus className="h-4 w-4" />
            </Button>
          </Tooltip>
        </Access>
      </div>
      <div className="relative overflow-x-auto">
        <Table
          rowKey={(record) => record.deviceId}
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

        <ViewDevice
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalDevice
          data={data}
          setData={setData}
          openModalDevice={openModalDevice}
          setOpenModalDevice={setOpenModalDevice}
          fetchData={fetchData}
          listSystems={listSystems}
          listLocations={listLocations}
          listDeviceTypes={listDeviceTypes}
          listSystemMaintenanceServices={listSystemMaintenanceServices}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default Device;
