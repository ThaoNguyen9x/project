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
  callDeleteOffice,
  callGetAllOffices,
  callGetAllLocations,
} from "../../services/api";

import ModalOffice from "../../components/admin/Office/modal.office";
import ViewOffice from "../../components/admin/Office/view.office";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import PDFViewer from "../../components/share/PDFViewer";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import Highlighter from "react-highlight-words";
import { AuthContext } from "../../components/share/Context";

const Office = () => {
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

  const [listLocations, setListLocations] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllLocations();
      if (res && res.data) {
        setListLocations(res.data?.result);
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
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setData(record);
              setOpenViewDetail(true);
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
      title: "Vị trí",
      dataIndex: "location",
      sorter: (a, b) => a.location.floor.localeCompare(b.location.floor),
      ...getColumnSearchProps("location.floor"),
      render: (text, record) => {
        return searchedColumn === "location.floor" ? (
          <HighlightText
            text={record?.location?.floor}
            searchText={searchText}
          />
        ) : (
          FORMAT_TEXT_LENGTH(record?.location?.floor, 20)
        );
      },
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      sorter: (a, b) => a.area - b.area,
      ...getColumnSearchProps("area"),
      render: (text, record) => {
        const formatted = `${record?.area} m²` || "N/A";

        return searchedColumn === "area" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Giá thuê",
      dataIndex: "rentPrice",
      sorter: (a, b) => a.rentPrice - b.rentPrice,
      ...getColumnSearchProps("rentPrice"),
      render: (text, record) => {
        const formatted =
          record?.rentPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "N/A";

        return searchedColumn === "rentPrice" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Phí dịch vụ",
      dataIndex: "serviceFee",
      sorter: (a, b) => a.serviceFee - b.serviceFee,
      ...getColumnSearchProps("serviceFee"),
      render: (text, record) => {
        const formatted =
          record?.serviceFee.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "N/A";

        return searchedColumn === "serviceFee" ? (
          <HighlightText text={formatted} searchText={searchText} />
        ) : (
          formatted
        );
      },
    },
    {
      title: "Bản vẽ",
      dataIndex: "drawingFile",
      render: (text, record) => {
        return record.drawingFile ? (
          <a
            onClick={() => {
              setPdfUrl(
                `${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
                  record?.drawingFile
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
      dataIndex: "status",
      filters: [
        {
          text: "Hoạt động",
          value: "ACTIV",
        },
        {
          text: "Không hoạt động",
          value: "INACTIV",
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
          <Access permission={ALL_PERMISSIONS.OFFICES.UPDATE} hideChildren>
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
          <Access permission={ALL_PERMISSIONS.OFFICES.DELETE} hideChildren>
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

    const res = await callGetAllOffices(query);
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
    const res = await callDeleteOffice(id);

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
        <h2 className="text-base xl:text-xl font-bold">Văn phòng</h2>
        <Access permission={ALL_PERMISSIONS.OFFICES.CREATE} hideChildren>
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

        <ViewOffice
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalOffice
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listLocations={listLocations}
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

export default Office;
