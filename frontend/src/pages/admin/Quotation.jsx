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
  Tooltip,
} from "antd";

import { AiOutlineDelete } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteQuotation,
  callGetAllQuotations,
  callGetAllRiskAssessments,
  callGetQuotation,
  callGetRepairProposal,
} from "../../services/api";

import ModalQuotation from "../../components/admin/System_Service/Quotation/modal.quotation";
import ViewQuotation from "../../components/admin/System_Service/Quotation/view.quotation";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import PDFViewer from "../../components/share/PDFViewer";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { AuthContext } from "../../components/share/Context";
import HighlightText from "../../components/share/HighlightText";
import { useLocation, useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";

const Quotation = () => {
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
  const [openModalQuotation, setOpenModalQuotation] = useState(false);
  const [data, setData] = useState(null);
  const [dataView, setDataView] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [listRiskAssessments, setListRiskAssessments] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllRiskAssessments();
      if (res && res.data) {
        setListRiskAssessments(res.data?.result);
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
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      sorter: true,
      ...getColumnSearchProps("supplierName"),
      render: (text, record, index) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetQuotation(record?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "supplierName" ? (
              <HighlightText
                text={record?.supplierName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(record?.supplierName, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Đề xuất bảo trì",
      dataIndex: "repairProposal",
      sorter: (a, b) =>
        a.repairProposal.title.localeCompare(b.repairProposal.title),
      ...getColumnSearchProps("repairProposal.title"),
      render: (repairProposal) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetRepairProposal(repairProposal?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "repairProposal.title" ? (
              <HighlightText
                text={repairProposal?.title}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(repairProposal?.title, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Tổng tiền báo giá",
      dataIndex: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      ...getColumnSearchProps("totalAmount"),
      render: (text, record) => {
        const formatted =
          record?.totalAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }) || 0;

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
                `${import.meta.env.VITE_BACKEND_URL}/storage/quotations/${
                  record?.fileName
                }`
              );
              setPreviewOpen(true);
            }}
          >
            Xem
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
          text: "Đang chờ duyệt",
          value: "PENDING",
        },
        {
          text: "Đã được duyệt",
          value: "APPROVED",
        },
        {
          text: "Bị từ chối",
          value: "REJECTED",
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
              : "success"
          } status`}
        >
          {record.status === "PENDING"
            ? "Đang chờ duyệt"
            : record.status === "APPROVED"
            ? "Đã được duyệt"
            : "Bị từ chối"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access permission={ALL_PERMISSIONS.QUOTATIONS.UPDATE} hideChildren>
            <Tooltip placement="bottom" title="Chỉnh sửa">
              <div
                onClick={async () => {
                  const res = await callGetQuotation(record?.id);
                  if (res?.data) {
                    setData(res?.data);
                    setOpenModalQuotation(true);
                  }
                }}
                className="cursor-pointer text-amber-900"
              >
                <CiEdit className="h-5 w-5" />
              </div>
            </Tooltip>
          </Access>
          <Access permission={ALL_PERMISSIONS.QUOTATIONS.DELETE} hideChildren>
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

    const res = await callGetAllQuotations(query);
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
    const res = await callDeleteQuotation(id);

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
      const fetchRequest = async () => {
        fetchData();

        const res = await callGetRepairProposal(id);
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
        <h2 className="text-base xl:text-xl font-bold">
          Báo giá & Đề xuất bảo trì
        </h2>
        <Access permission={ALL_PERMISSIONS.QUOTATIONS.CREATE} hideChildren>
          <Tooltip placement="bottom" title="Thêm">
            <Button
              onClick={() => setOpenModalQuotation(true)}
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

        <ViewQuotation
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalQuotation
          data={data}
          setData={setData}
          openModalQuotation={openModalQuotation}
          setOpenModalQuotation={setOpenModalQuotation}
          fetchData={fetchData}
          listRiskAssessments={listRiskAssessments}
          setCurrent={setCurrent}
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

export default Quotation;
