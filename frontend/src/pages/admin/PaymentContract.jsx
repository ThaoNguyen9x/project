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
  callDeletePaymentContract,
  callGetAllPaymentContracts,
  callGetAllContracts,
  callPaymentStripe,
  callPaymentStatus,
  callGetPaymentContract,
  callGetContract,
} from "../../services/api";

import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ModalPaymentContract from "../../components/admin/Payment_Contract/modal.payment-contract";
import ViewPaymentContract from "../../components/admin/Payment_Contract/view.payment-contract";
import Highlighter from "react-highlight-words";
import HighlightText from "../../components/share/HighlightText";
import { FORMAT_TEXT_LENGTH } from "../../utils/constant";
import { TbNotification } from "react-icons/tb";
import { AuthContext } from "../../components/share/Context";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentContract = () => {
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

  const [listContracts, setListContracts] = useState([]);

  useEffect(() => {
    const init = async () => {
      const contracts = await callGetAllContracts(`page=1&size=100`);
      if (contracts && contracts.data) {
        setListContracts(contracts.data?.result);
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
      title: "Số tiền thanh toán",
      dataIndex: "paymentAmount",
      sorter: (a, b) => a.paymentAmount - b.paymentAmount,
      ...getColumnSearchProps("paymentAmount"),
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetPaymentContract(record?.paymentId);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "paymentAmount" ? (
              <HighlightText
                text={record?.paymentAmount}
                searchText={searchText}
              />
            ) : (
              record?.paymentAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            )}
          </a>
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "contract",
      sorter: (a, b) =>
        a.contract.customer.companyName.localeCompare(
          b.contract.customer.companyName
        ),
      ...getColumnSearchProps("contract.customer.companyName"),
      render: (contract) => {
        return (
          <a
            onClick={async () => {
              const res = await callGetContract(contract?.id);
              if (res?.data) {
                setDataView(res?.data);
                setOpenViewDetail(true);
              }
            }}
          >
            {searchedColumn === "contract.customer.companyName" ? (
              <HighlightText
                text={contract?.customer?.companyName}
                searchText={searchText}
              />
            ) : (
              FORMAT_TEXT_LENGTH(contract?.customer?.companyName, 20)
            )}
          </a>
        );
      },
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      ...getColumnSearchProps("dueDate"),
      render: (text, record, index) => record?.dueDate || "N/A",
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
      ...getColumnSearchProps("paymentDate"),
      render: (text, record, index) => record?.paymentDate || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
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
      onFilter: (value, record) => record?.paymentStatus === value,
      render: (paymentStatus, record) => (
        <span
          className={`${
            paymentStatus === "UNPAID" ? "danger" : "success"
          } status`}
        >
          {paymentStatus === "UNPAID" ? "Chưa thanh toán" : "Đã thanh toán"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (text, record) => {
        return (
          <div className="flex items-center gap-3">
            {record?.paymentStatus === "UNPAID" &&
            user?.role?.name === "Customer" ? (
              <Button
                onClick={() => {
                  handlePaymentStripe(
                    record?.paymentId,
                    record?.contract?.id,
                    record?.paymentStatus === "UNPAID" ? "UNPAID" : "PAID",
                    record?.dueDate,
                    record?.paymentAmount
                  );
                }}
              >
                Thanh toán
              </Button>
            ) : (
              ""
            )}
            <Tooltip placement="bottom" title="Chỉnh sửa">
              <>
                <Access
                  permission={ALL_PERMISSIONS.PAYMENT_CONTRACTS.UPDATE}
                  hideChildren
                >
                  <div
                    onClick={async () => {
                      const res = await callGetPaymentContract(
                        record?.paymentId
                      );
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
              </>
            </Tooltip>
            <Tooltip placement="bottom" title="Xóa">
              <>
                <Access
                  permission={ALL_PERMISSIONS.PAYMENT_CONTRACTS.DELETE}
                  hideChildren
                >
                  <Popconfirm
                    placement="leftBottom"
                    okText="Có"
                    cancelText="Không"
                    title="Xác nhận"
                    description="Bạn có chắc chắn muốn xóa không?"
                    onConfirm={() => handleDelete(record.paymentId)}
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
              </>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [searchedColumn, searchText, current, pageSize, sortQuery]);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );
      if (!sessionId) return;

      const res = await callPaymentStatus(sessionId);

      if (typeof res === "string") {
        if (res && res === "Success") {
          fetchData();
          message.success("Thanh toán thành công");
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: "Thanh toán chưa hoàn thành hoặc phiên không hợp lệ",
          });
        }

        const url = new URL(window.location);
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", url.toString());
      }
    };

    fetchPaymentStatus();
  }, []);

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

    const res = await callGetAllPaymentContracts(query);
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

  const handleDelete = async (paymentId) => {
    const res = await callDeletePaymentContract(paymentId);

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

  const handlePaymentStripe = async (
    paymentId,
    contract,
    paymentStatus,
    dueDate,
    paymentAmount
  ) => {
    const res = await callPaymentStripe(
      paymentId,
      {
        id: contract,
      },
      paymentStatus,
      dueDate,
      paymentAmount
    );

    if (res && res.data && res.data.sessionUrl) {
      window.location.href = res.data.sessionUrl;
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
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

        const res = await callGetPaymentContract(id);
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
        <h2 className="text-base xl:text-xl font-bold">Hợp đồng thanh toán</h2>
        <Access
          permission={ALL_PERMISSIONS.PAYMENT_CONTRACTS.CREATE}
          hideChildren
        >
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
          rowKey={(record) => record.paymentId}
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

        <ViewPaymentContract
          user={user}
          data={dataView}
          setData={setDataView}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />

        <ModalPaymentContract
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listContracts={listContracts}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default PaymentContract;
