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
  callGetAllSystemMaintenanceServices,
  callGetMaintenanceHistory,
  callGetRiskAssessment,
} from "../../services/api";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ViewMaintenanceHistory from "../../components/admin/Property_Manager/Maintenance_History/view.maintenance-history";
import ModalMaintenanceHistory from "../../components/admin/Property_Manager/Maintenance_History/modal.maintenance-history";
import Highlighter from "react-highlight-words";
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
  const [openModalMaintenanceHistory, setOpenModalMaintenanceHistory] =
    useState(false);
  const [data, setData] = useState(null);
  const [dataView, setDataView] = useState(null);

  const [listSystemMaintenanceServices, setListSystemMaintenanceServices] =
    useState([]);
  const [listDevices, setListDevices] = useState([]);

  const fetchAllPages = async (apiCall, pageSize) => {
    let page = 1;
    let allResults = [];
    let hasMore = true;

    while (hasMore) {
      const query = `page=${page}&size=${pageSize}`;
      const response = await apiCall(query);
      const result = response?.data?.result || [];
      allResults = [...allResults, ...result];

      if (result.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    }
    return allResults;
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const pageSize = 20;

      const systemMaintenanceServices = await fetchAllPages(
        callGetAllSystemMaintenanceServices,
        pageSize
      );
      setListSystemMaintenanceServices(systemMaintenanceServices);

      const devices = await fetchAllPages(callGetAllDevices, pageSize);
      setListDevices(devices);

      setIsLoading(false);
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

    const res = await callGetAllMaintenanceHistories(query);
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

  const handleDelete = async (maintenanceHistoryId, riskAssessmentId) => {
    const resRiskAssessment = await callDeleteRiskAssessment(riskAssessmentId);
    if (!resRiskAssessment || resRiskAssessment.statusCode !== 200) {
      return notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể đánh giá rủi ro.",
      });
    }

    const resMaintenanceHistory = await callDeleteMaintenanceHistory(
      maintenanceHistoryId
    );
    if (!resMaintenanceHistory || resMaintenanceHistory.statusCode !== 200) {
      return notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể lịch sử bảo trì.",
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
          permission={ALL_PERMISSIONS.MAINTENANCE_HISTORIES.CREATE}
          hideChildren
        >
          <Button
            onClick={() => setOpenModalMaintenanceHistory(true)}
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
                    onClick={async () => {
                      const res = await callGetMaintenanceHistory(record?.id);
                      if (res?.data) {
                        setDataView(res?.data);
                        setOpenViewDetail(true);
                      }
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
                  record?.riskAssessments?.[0]?.assessmentDate;
                return assessmentDate ? (
                  <a
                    onClick={async () => {
                      const res = await callGetRiskAssessment(
                        record?.riskAssessments?.[0]?.riskAssessmentID
                      );
                      if (res?.data) {
                        setDataView(res?.data);
                        setOpenViewDetail(true);
                      }
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
                  permission={ALL_PERMISSIONS.MAINTENANCE_HISTORIES.UPDATE}
                  hideChildren
                >
                  <div
                    onClick={async () => {
                      const res = await callGetMaintenanceHistory(record?.id);
                      if (res?.data) {
                        setData(res?.data);
                        setOpenModalMaintenanceHistory(true);
                      }
                    }}
                    className="cursor-pointer text-amber-900"
                  >
                    <CiEdit className="h-5 w-5" />
                  </div>
                </Access>
                <Access
                  permission={ALL_PERMISSIONS.MAINTENANCE_HISTORIES.DELETE}
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
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalMaintenanceHistory
          data={data}
          setData={setData}
          openModalMaintenanceHistory={openModalMaintenanceHistory}
          setOpenModalMaintenanceHistory={setOpenModalMaintenanceHistory}
          fetchData={fetchData}
          listSystemMaintenanceServices={listSystemMaintenanceServices}
          listDevices={listDevices}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default MaintenanceHistory;
