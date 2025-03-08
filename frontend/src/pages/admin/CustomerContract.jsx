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
import { MailOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  callDeleteContract,
  callGetAllContracts,
  callGetAllLocations,
  callGetAllCustomerTypes,
  callGetAllCustomerTypeDocuments,
  callGetContract,
  callSendMailContract,
  callSendContract,
} from "../../services/api";

import ModalCustomerContract from "../../components/admin/Customer_Service/Customer_Contract/modal.customer-contract";
import ViewCustomerContract from "../../components/admin/Customer_Service/Customer_Contract/view.customer-contract";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import PDFViewer from "../../components/share/PDFViewer";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import Highlighter from "react-highlight-words";
import { AuthContext } from "../../components/share/Context";
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { useLocation, useNavigate } from "react-router-dom";

const CustomerContract = () => {
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [listCustomerTypes, setListCustomerTypes] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listCustomerTypeDocuments, setListCustomerTypeDocuments] = useState(
    []
  );

  useEffect(() => {
    const init = async () => {
      const customerTypes = await callGetAllCustomerTypes(`page=1&size=100`);
      if (customerTypes && customerTypes.data) {
        setListCustomerTypes(customerTypes.data?.result);
      }

      const locations = await callGetAllLocations(`page=1&size=100`);
      if (locations && locations.data) {
        setListLocations(locations.data?.result);
      }

      const customerTypeDocuments = await callGetAllCustomerTypeDocuments(
        `page=1&size=100`
      );
      if (customerTypeDocuments && customerTypeDocuments.data) {
        setListCustomerTypeDocuments(customerTypeDocuments.data?.result);
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

    const res = await callGetAllContracts(query);
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
    const res = await callDeleteContract(id);
    if (res && res.statusCode === 200) {
      message.success(res.message);
      fetchData();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Dữ liệu đang sử dụng, không thể xóa",
      });
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    if (id) {
      fetchData();

      const fetchRequest = async () => {
        const res = await callGetContract(id);
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
        <h2 className="text-base xl:text-xl font-bold">Hợp đồng khách hàng</h2>
        <Access permission={ALL_PERMISSIONS.CONTRACTS.CREATE} hideChildren>
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
          <ColumnGroup title="Khách hàng">
            <Column
              title="Công ty"
              dataIndex={["customer", "companyName"]}
              sorter={(a, b) =>
                a.customer?.companyName.localeCompare(b.customer?.companyName)
              }
              {...getColumnSearchProps("customer.companyName")}
              render={(text, record) => {
                return (
                  <a
                    onClick={async () => {
                      const res = await callGetContract(record?.id);
                      if (res?.data) {
                        setDataView(res?.data);
                        setOpenViewDetail(true);
                      }
                    }}
                  >
                    {searchedColumn === "customer.companyName" ? (
                      <HighlightText text={text} searchText={searchText} />
                    ) : (
                      FORMAT_TEXT_LENGTH(text, 20)
                    )}
                  </a>
                );
              }}
            />

            <Column
              title="Giám đốc"
              dataIndex={["customer", "directorName"]}
              sorter={(a, b) =>
                a.customer?.directorName.localeCompare(b.customer?.directorName)
              }
              {...getColumnSearchProps("customer.directorName")}
              render={(text, record) => {
                return searchedColumn === "customer.directorName" ? (
                  <HighlightText text={text} searchText={searchText} />
                ) : (
                  FORMAT_TEXT_LENGTH(text, 20)
                );
              }}
            />
          </ColumnGroup>
          <ColumnGroup title="Hợp đồng">
            <Column
              title="Ngày bắt đầu"
              dataIndex="startDate"
              sorter={(a, b) => a.startDate.localeCompare(b.startDate)}
              {...getColumnSearchProps("startDate")}
              render={(text, record) => {
                return searchedColumn === "startDate" ? (
                  <HighlightText text={text} searchText={searchText} />
                ) : (
                  FORMAT_TEXT_LENGTH(text, 20)
                );
              }}
            />
            <Column
              title="Ngày kết thúc"
              dataIndex="endDate"
              sorter={(a, b) => a.endDate.localeCompare(b.endDate)}
              {...getColumnSearchProps("endDate")}
              render={(text, record) => {
                return searchedColumn === "endDate" ? (
                  <HighlightText text={text} searchText={searchText} />
                ) : (
                  FORMAT_TEXT_LENGTH(text, 20)
                );
              }}
            />
            <Column
              title="Tổng số tiền"
              dataIndex="totalAmount"
              sorter={(a, b) => (a.totalAmount || 0) - (b.totalAmount || 0)}
              {...getColumnSearchProps("totalAmount")}
              render={(text, record) => {
                const formatted = record?.totalAmount
                  ? record.totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  : "0";

                return searchedColumn === "totalAmount" ? (
                  <HighlightText text={formatted} searchText={searchText} />
                ) : (
                  formatted
                );
              }}
            />
            <Column
              title="File hợp đồng"
              dataIndex="fileName"
              render={(text, record) =>
                record?.fileName ? (
                  <a
                    onClick={() => {
                      setPdfUrl(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/storage/contracts/${record?.fileName}`
                      );
                      setPreviewOpen(true);
                    }}
                  >
                    Xem
                  </a>
                ) : (
                  "Chưa có"
                )
              }
            />
            <Column
              title="Trạng thái"
              dataIndex="leaseStatus"
              filters={[
                {
                  text: "Hoạt động",
                  value: "Active",
                },
                {
                  text: "Đã chấm dứt",
                  value: "Inactive",
                },
                {
                  text: "Đang chờ gia hạn",
                  value: "Wait",
                },
                {
                  text: "Đang chờ xử lý",
                  value: "Pending",
                },
                {
                  text: "Đã sửa",
                  value: "Corrected",
                },
                {
                  text: "Đang chờ xác nhận",
                  value: "W_Confirmation",
                },
                {
                  text: "Đã gửi hợp đồng",
                  value: "Send",
                },
                {
                  text: "Đang chờ xác nhận lần 2",
                  value: "W_Confirmation_2",
                },
                {
                  text: "Từ chối",
                  value: "Rejected",
                },
                {
                  text: "Chấp nhận",
                  value: "Approved",
                },
              ]}
              onFilter={(value, record) => record?.leaseStatus === value}
              render={(leaseStatus) => {
                const statusMap = {
                  Active: { text: "Hoạt động", className: "success" },
                  Inactive: { text: "Đã chấm dứt", className: "danger" },
                  Wait: { text: "Đang chờ gia hạn", className: "warning" },
                  Pending: {
                    text: "Đang chờ xử lý",
                    className: "bg-gray-200",
                  },
                  Corrected: {
                    text: "Đã sửa",
                    className: "bg-gray-200",
                  },
                  Send: {
                    text: "Đã gửi hợp đồng",
                    className: "bg-green-500 text-white",
                  },
                  W_Confirmation: {
                    text: "Đang chờ xác nhận",
                    className: "bg-red-500 text-white",
                  },
                  W_Confirmation_2: {
                    text: "Đang chờ xác nhận lần 2",
                    className: "bg-red-500 text-white",
                  },
                  Rejected: {
                    text: "Từ chối",
                    className: "bg-red-700 text-white",
                  },
                  Approved: {
                    text: "Chấp nhận",
                    className: "bg-blue-950 text-white",
                  },
                };

                const status = statusMap[leaseStatus] || {
                  text: leaseStatus,
                  className: "",
                };

                return (
                  <span className={`${status.className} status`}>
                    {status.text}
                  </span>
                );
              }}
            />
          </ColumnGroup>
          <Column
            title="Thao tác"
            render={(text, record) => (
              <div className="flex items-center gap-3">
                {record?.leaseStatus === "Pending" ||
                record?.leaseStatus === "Corrected" ||
                record?.leaseStatus === "Approved" ? (
                  <Access
                    permission={ALL_PERMISSIONS.CONTRACTS.SEND}
                    hideChildren
                  >
                    <Tooltip
                      placement="bottom"
                      title={`${
                        record?.leaseStatus === "Pending"
                          ? "Gửi mail cấp tài khoản"
                          : record?.leaseStatus === "Approved"
                          ? "Gửi hợp đồng cho khách hàng ký"
                          : "Gửi mail xác nhận lần 2"
                      }`}
                    >
                      <Popconfirm
                        placement="leftBottom"
                        okText="Có"
                        cancelText="Không"
                        title="Xác nhận"
                        description={`Bạn có muốn ${
                          record?.leaseStatus === "Pending"
                            ? "gửi mail cấp tài khoản"
                            : record?.leaseStatus === "Approved"
                            ? "gửi hợp đồng cho khách hàng ký"
                            : "gửi mail xác nhận lần 2 không?"
                        }`}
                        onConfirm={async () => {
                          if (record?.leaseStatus === "Approved") {
                            const res = await callSendContract(record?.id);
                            if (
                              res &&
                              typeof res === "string" &&
                              res.includes(
                                "Yêu cầu ký hợp đồng đã được gửi qua email"
                              )
                            ) {
                              notification.error({
                                message: "Có lỗi xảy ra",
                                description:
                                  "Không nhận được phản hồi từ server",
                              });
                            } else {
                              message.success(
                                "Yêu cầu ký đã được gửi qua email thành công"
                              );
                              fetchData();
                            }
                          } else {
                            const res = await callSendMailContract(record?.id);
                            if (res && res.statusCode === 200) {
                              message.success(res.message);
                              fetchData();
                            } else {
                              notification.error({
                                message: "Có lỗi xảy ra",
                                description: res.error,
                              });
                            }
                          }
                        }}
                        icon={
                          <QuestionCircleOutlined
                            style={{
                              color: "red",
                            }}
                          />
                        }
                        className="cursor-pointer text-amber-900"
                      >
                        <MailOutlined className="h-5 w-5" />
                      </Popconfirm>
                    </Tooltip>
                  </Access>
                ) : (
                  ""
                )}
                <Access
                  permission={ALL_PERMISSIONS.CONTRACTS.UPDATE}
                  hideChildren
                >
                  <Tooltip placement="bottom" title="Chỉnh sửa">
                    <div
                      onClick={async () => {
                        const res = await callGetContract(record?.id);
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
                <Access
                  permission={ALL_PERMISSIONS.CONTRACTS.DELETE}
                  hideChildren
                >
                  <Tooltip placement="bottom" title="Xóa">
                    <Popconfirm
                      placement="leftBottom"
                      okText="Có"
                      cancelText="Không"
                      title="Xác nhận"
                      description="Bạn có chắc chắn muốn xóa không?"
                      onConfirm={() =>
                        handleDelete(record?.id, record?.customer?.id)
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
                  </Tooltip>
                </Access>
              </div>
            )}
          />
        </Table>

        <ViewCustomerContract
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          fetchData={fetchData}
        />

        <ModalCustomerContract
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listCustomerTypes={listCustomerTypes}
          listLocations={listLocations}
          listCustomerTypeDocuments={listCustomerTypeDocuments}
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

export default CustomerContract;
