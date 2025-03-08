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
  Image,
} from "antd";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteElectricityUsage,
  callGetAllElectricityUsages,
  callGetAllMeters,
  callGetElectricityUsage,
} from "../../services/api";

import ModalElectricityUsage from "../../components/admin/System_Service/Electricity_Usage/modal.electricity-usage";
import ViewElectricityUsage from "../../components/admin/System_Service/Electricity_Usage/view.electricity-usage";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";
import Highlighter from "react-highlight-words";
import { useLocation, useNavigate } from "react-router-dom";

const ElectricityUsage = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [listMeters, setListMeters] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllMeters();
      if (res && res.data) {
        setListMeters(res.data?.result);
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
      title: "Đồ hồ đo",
      dataIndex: "meter",
      sorter: (a, b) =>
        a.meter.serialNumber.localeCompare(b.meter.serialNumber),
      ...getColumnSearchProps("meter.serialNumber"),
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetElectricityUsage(record?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "serialNumber" ? (
              <HighlightText
                text={record?.meter?.serialNumber}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(record?.meter?.serialNumber, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Bắt đầu đọc",
      dataIndex: "startReading",
      sorter: (a, b) => a.startReading - b.startReading,
      ...getColumnSearchProps("startReading"),
      render: (text, record) => {
        const formatted = `${record?.startReading}` || "N/A";

        return searchedColumn === "startReading" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Kết thúc đọc",
      dataIndex: "endReading",
      sorter: (a, b) => a.endReading - b.endReading,
      ...getColumnSearchProps("endReading"),
      render: (text, record) => {
        const formatted = `${record?.endReading}` || "N/A";

        return searchedColumn === "endReading" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Số lượng sử dụng",
      dataIndex: "usageAmount",
      sorter: (a, b) => a.usageAmount - b.usageAmount,
      ...getColumnSearchProps("usageAmount"),
      render: (text, record) => {
        const formatted = `${record?.usageAmount}` || "N/A";

        return searchedColumn === "usageAmount" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Ngày đọc",
      dataIndex: "readingDate",
      sorter: (a, b) => new Date(a.readingDate) - new Date(b.readingDate),
      ...getColumnSearchProps("readingDate"),
      render: (text, record, index) => record?.readingDate || "N/A",
    },
    {
      title: "Image",
      dataIndex: "imageName",
      render: (text, record, index) => (
        <Image
          src={
            record?.imageName
              ? `${
                  import.meta.env.VITE_BACKEND_URL
                }/storage/electricity-usages/${record?.imageName}`
              : "N/A"
          }
          width={64}
          alt="Image"
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Chấp nhận",
          value: "YES",
        },
        {
          text: "Từ chối",
          value: "NO",
        },
        {
          text: "Chưa xác nhận",
          value: "PENDING",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <span
          className={`${
            status === "YES"
              ? "success"
              : status === "PENDING"
              ? "warning"
              : "danger"
          } status`}
        >
          {status === "YES"
            ? "Chấp nhận"
            : status === "PENDING"
            ? "Chưa xác nhận"
            : "Từ chối"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access
            permission={ALL_PERMISSIONS.ELECTRICITY_USAGES.UPDATE}
            hideChildren
          >
            <div
              onClick={async () => {
                const res = await callGetElectricityUsage(record?.id);
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
            permission={ALL_PERMISSIONS.ELECTRICITY_USAGES.DELETE}
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

    const res = await callGetAllElectricityUsages(query);
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
      const q = `sort=${sortField}~${sortOrder}`;
      setSortQuery(q);
    } else {
      setSortQuery("");
    }
  };

  const handleDelete = async (id) => {
    const res = await callDeleteElectricityUsage(id);

    if (res && res && res.statusCode === 200) {
      message.success(res.message);
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    if (id) {
      const fetchRequest = async () => {
        const res = await callGetElectricityUsage(id);
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
        <h2 className="text-base xl:text-xl font-bold">Mức tiêu thụ điện</h2>
        <Access
          permission={ALL_PERMISSIONS.ELECTRICITY_USAGES.CREATE}
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

        <ViewElectricityUsage
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          fetchData={fetchData}
          setCurrent={setCurrent}
        />

        <ModalElectricityUsage
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listMeters={listMeters}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default ElectricityUsage;
