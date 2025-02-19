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
  callDeleteRiskAssessment,
  callGetAllDevices,
  callGetAllMaintenanceHistories,
  callGetAllSubcontracts,
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
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";

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
  const [listSubcontractors, setListSubcontractors] = useState([]);
  const [listDevices, setListDevices] = useState([]);

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

      const subcontractors = await callGetAllSubcontracts();
      if (subcontractors && subcontractors.data) {
        setListSubcontractors(subcontractors.data?.result);
      }

      const devices = await callGetAllDevices();
      if (devices && devices.data) {
        setListDevices(devices.data?.result);
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

  const handleDelete = async (maintenanceHistoryId, riskAssessmentId) => {
    const resRiskAssessment = await callDeleteRiskAssessment(riskAssessmentId);
    if (!resRiskAssessment || resRiskAssessment.statusCode !== 200) {
      return notification.error({
        message: "Có lỗi xảy ra",
        description: resRiskAssessment?.error || "Không thể đánh giá rủi ro.",
      });
    }

    const resMaintenanceHistory = await callDeleteMaintenanceHistory(
      maintenanceHistoryId
    );
    if (!resMaintenanceHistory || resMaintenanceHistory.statusCode !== 200) {
      return notification.error({
        message: "Có lỗi xảy ra",
        description:
          resMaintenanceHistory?.error || "Không thể lịch sử bảo trì.",
      });
    }

    message.success("Xóa lịch sử bảo trì & đánh giá rủi ro thành công!");
    fetchData();
  };

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base xl:text-xl font-bold">
          Lịch sử bảo trì & Đánh giá rủi ro
        </h2>
        <Access
          permission={ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.CREATE}
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
          dataSource={list}
          rowKey={(record) => record?.id}
          loading={isLoading}
          onChange={onChange}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        >
          <Column
            title="STT"
            key="index"
            fixed="left"
            render={(text, record, index) =>
              (current - 1) * pageSize + index + 1
            }
          />
          <ColumnGroup title="Lịch sử bảo trì">
            <Column
              title="Ngày thực hiện"
              dataIndex="performedDate"
              sorter={(a, b) =>
                new Date(a.performedDate) - new Date(b.performedDate)
              }
              render={(text, record) => {
                return (
                  <a
                    onClick={() => {
                      setData(record);
                      setOpenViewDetail(true);
                    }}
                  >
                    {record?.performedDate}
                  </a>
                );
              }}
            />
            <Column title="Ghi chú" dataIndex="notes" key="notes" />
          </ColumnGroup>
          <ColumnGroup title="Đánh giá rủi ro">
            <Column
              title="Ngày đánh giá"
              key="riskAssessmentsAssessmentDate"
              sorter={(a, b) => {
                const dateA = new Date(
                  a.riskAssessments?.[0]?.assessmentDate || 0
                );
                const dateB = new Date(
                  b.riskAssessments?.[0]?.assessmentDate || 0
                );
                return dateA - dateB;
              }}
              render={(_, record) => {
                const assessmentDate =
                  record.riskAssessments?.[0]?.assessmentDate;
                return assessmentDate ? (
                  <a
                    onClick={() => {
                      setData(record.riskAssessments?.[0]);
                      setOpenViewDetail(true);
                    }}
                  >
                    {assessmentDate}
                  </a>
                ) : (
                  "N/A"
                );
              }}
            />
          </ColumnGroup>
          <Column
            title="Thao tác"
            render={(text, record) => (
              <div className="flex items-center gap-3">
                <Access
                  permission={ALL_PERMISSIONS.CONTRACTS.UPDATE}
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
                  permission={ALL_PERMISSIONS.CONTRACTS.DELETE}
                  hideChildren
                >
                  <Popconfirm
                    placement="leftBottom"
                    okText="Có"
                    cancelText="Không"
                    title="Xác nhận"
                    description="Bạn có chắc chắn muốn xóa không?"
                    onConfirm={() =>
                      handleDelete(
                        record?.id,
                        record.riskAssessments?.[0]?.riskAssessmentID
                      )
                    }
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
            )}
          />
        </Table>

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
          listSubcontractors={listSubcontractors}
          listDevices={listDevices}
        />
      </div>
    </div>
  );
};

export default MaintenanceHistory;
