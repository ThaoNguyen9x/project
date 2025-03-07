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
  callDeleteRepairProposal,
  callGetAllRepairProposals,
  callGetAllRiskAssessments,
  callGetRepairProposal,
} from "../../services/api";

import ModalRepairProposal from "../../components/admin/System_Service/Repair_Proposal/modal.repair-proposal";
import ViewRepairProposal from "../../components/admin/System_Service/Repair_Proposal/view.repair-proposal";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import PDFViewer from "../../components/share/PDFViewer";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import HighlightText from "../../components/share/HighlightText";
import Highlighter from "react-highlight-words";
import { AuthContext } from "../../components/share/Context";
import { useLocation } from "react-router-dom";

const RepairProposal = () => {
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

  const [listRiskAssessments, setRiskAssessments] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllRiskAssessments();
      if (res && res.data) {
        setRiskAssessments(res.data?.result);
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
          placeholder={`Search ${dataIndex}`}
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      title: "Tiêu đề",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps("title"),
      render: (text, record, index) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetRepairProposal(record?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "title" ? (
              <HighlightText text={record?.title} searchText={searchText} />
            ) : (
              FORMAT_TEXT_LENGTH(record?.title, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      sorter: (a, b) => {
        const descriptionA = a.description || "";
        const descriptionB = b.description || "";
        return descriptionA.localeCompare(descriptionB);
      },
      ...getColumnSearchProps("description"),
      render: (text, record) => {
        const description = record.description || "N/A";
        return searchedColumn === "description" ? (
          <HighlightText text={description} searchText={searchText} />
        ) : (
          FORMAT_TEXT_LENGTH(description, 20)
        );
      },
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      sorter: (a, b) => new Date(a.requestDate) - new Date(b.requestDate),
      ...getColumnSearchProps("requestDate"),
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      sorter: (a, b) => a.priority - b.priority,
      ...getColumnSearchProps("priority"),
    },
    {
      title: "Loại đề xuất",
      dataIndex: "proposalType",
      filters: [
        {
          text: "Đánh giá rủi ro",
          value: "RISK_ASSESSMENT",
        },
        {
          text: "Sự cố bất thường",
          value: "ABNORMAL_FAILURE",
        },
      ],
      onFilter: (value, record) => record?.status === value,
      render: (status, record) => (
        <span
          className={`${
            status === "RISK_ASSESSMENT" ? "warning" : "danger"
          } status`}
        >
          {status === "RISK_ASSESSMENT"
            ? "Đánh giá rủi ro"
            : "Sự cố bất thường"}
        </span>
      ),
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
        {
          text: "Đang triển khai",
          value: "IN_PROGRESS",
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
            status === "COMPLETED"
              ? "success"
              : status === "PENDING"
              ? "warning"
              : status === "REJECTED"
              ? "danger"
              : status === "APPROVED"
              ? "bg-blue-100 text-blue-900"
              : "bg-purple-100 text-purple-900"
          } status`}
        >
          {status === "COMPLETED"
            ? "Đã hoàn thành"
            : status === "PENDING"
            ? "Đang chờ duyệt"
            : status === "APPROVED"
            ? "Đã được duyệt"
            : status === "REJECTED"
            ? "Bị từ chối"
            : "Đang triển khai"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Access
            permission={ALL_PERMISSIONS.REPAIR_PROPOSALS.UPDATE}
            hideChildren
          >
            <div
              onClick={async () => {
                const res = await callGetRepairProposal(record?.id);
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
            permission={ALL_PERMISSIONS.REPAIR_PROPOSALS.DELETE}
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

    const res = await callGetAllRepairProposals(query);
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
    const res = await callDeleteRepairProposal(id);

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

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    if (id) {
      const fetchRequest = async () => {
        const res = await callGetAllRepairProposals(`filter=id~'${id}'`);
        if (res?.data?.result.length) {
          setDataView(res.data.result[0]);
          setOpenViewDetail(true);
        }
      };
      fetchRequest();
    }
  }, [location.search]);

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">Đề xuất bảo trì</h2>
        <Access
          permission={ALL_PERMISSIONS.REPAIR_PROPOSALS.CREATE}
          hideChildren
        >
          <Button
            onClick={() => setOpenModal(true)}
            className="p-2 xl:p-3 gap-1 xl:gap-2"
          >
            <GoPlus className="h-4 w-4" />
            Add
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

        <ViewRepairProposal
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalRepairProposal
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listRiskAssessments={listRiskAssessments}
        />
      </div>
    </div>
  );
};

export default RepairProposal;
