import dayjs from "dayjs";
import { Button, Descriptions, Drawer, Rate, Space, Steps } from "antd";
import {
  FORMAT_DATE_DISPLAY,
  FORMAT_DATE_TIME_DISPLAY,
  shortenFileName,
} from "../../../utils/constant";
import {
  callGetContract,
  callGetCustomer,
  callGetCustomerType,
  callGetDevice,
  callGetDeviceType,
  callGetItemCheck,
  callGetMaintenanceHistory,
  callGetMeter,
  callGetOffice,
  callGetResultCheck,
  callGetRiskAssessment,
  callGetSubcontract,
  callGetSystem,
  callGetSystemMaintenanceService,
  callGetUser,
} from "../../../services/api";
import { useState } from "react";
import Access from "../../share/Access";
import { ALL_PERMISSIONS } from "../Access_Control/Permission/data/permissions";
import { GoPlus } from "react-icons/go";
import { CiEdit } from "react-icons/ci";

const ViewOffice = (props) => {
  const {
    user,
    data,
    setData,
    openViewDetail,
    setOpenViewDetail,
    setOpenModal,
    setOpenModalDevice,
    setOpenModalMaintenanceHistory,
    setOpenModalQuotation,
  } = props;
  const [historyStack, setHistoryStack] = useState([]);

  const onClose = () => {
    setOpenViewDetail(false);
    setData(null);
    setHistoryStack([]);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prevData = historyStack[historyStack.length - 1];
      setHistoryStack(historyStack.slice(0, -1));
      setData(prevData);
    }
  };

  const handleViewDetail = async (newData) => {
    setHistoryStack([...historyStack, data]);
    setData(newData);
    setOpenViewDetail(true);
  };

  const isOffice =
    data?.rentPrice &&
    !(
      data?.deviceId ||
      data?.description ||
      data?.systemName ||
      data?.fileName ||
      data?.role?.name ||
      data?.typeName ||
      data?.assessmentDate ||
      data?.performedDate ||
      data?.contractEndDate ||
      data?.serialNumber ||
      data?.companyName ||
      data?.nextScheduledDate
    );

  const isDevice =
    data?.deviceId &&
    !(
      data?.assessmentDate ||
      data?.performedDate ||
      data?.contractEndDate ||
      data?.description ||
      data?.systemName ||
      data?.fileName ||
      data?.companyName ||
      data?.role?.name ||
      data?.typeName ||
      data?.checkCategory
    );

  const generateItems = () => {
    if (data?.deviceId) {
      return [
        {
          label: "Tên thiết bị",
          children: data?.deviceName || "N/A",
          span: 2,
        },
        {
          label: "Loại thiết bị",
          children: data?.deviceType?.typeName ? (
            <a
              onClick={async () => {
                const res = await callGetDeviceType(data?.deviceType?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.deviceType?.typeName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        { label: "Tuổi thọ", children: data?.lifespan || "N/A" },
        { label: "Ngày cài đặt", children: data?.installationDate || "N/A" },
        { label: "Vị trí", children: data?.location?.floor || "N/A" },
        {
          label: "Hệ thống",
          children: data?.system?.systemName ? (
            <a
              onClick={async () => {
                const res = await callGetSystem(data?.system?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.system?.systemName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        { label: "Tọa độ X", children: data?.x || 0 },
        { label: "Tọa độ Y", children: data?.y || 0 },
        {
          label: "Dịch vụ bảo trì",
          children: (
            <>
              {data?.maintenanceService?.serviceType ? (
                <a
                  onClick={async () => {
                    const res = await callGetSystemMaintenanceService(
                      data?.maintenanceService?.id
                    );
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {data?.maintenanceService?.serviceType === "ELECTRICAL"
                    ? "Hệ thống điện"
                    : data?.maintenanceService?.serviceType === "PLUMBING"
                    ? "Hệ thống cấp thoát nước"
                    : data?.maintenanceService?.serviceType === "HVAC"
                    ? "Hệ thống điều hòa không khí"
                    : "Hệ thống phòng cháy"}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
          span: 2,
        },
        {
          label: "Đánh giá rủi ro",
          children:
            data?.riskAssessments?.length > 0 ? (
              data?.riskAssessments?.map((x) => (
                <div
                  key={x?.riskAssessmentID}
                  className="flex items-center gap-2 my-1"
                >
                  <a
                    onClick={async () => {
                      const res = await callGetRiskAssessment(
                        x?.riskAssessmentID
                      );
                      if (res?.data) {
                        handleViewDetail(res?.data);
                      }
                    }}
                  >
                    {x?.assessmentDate}
                  </a>
                  <Access
                    permission={ALL_PERMISSIONS.MAINTENANCE_HISTORIES.CREATE}
                    hideChildren
                  >
                    {isDevice && (
                      <Button
                        onClick={() => {
                          setOpenViewDetail(false);
                          setData({ riskAssessmentID: x?.riskAssessmentID });
                          setOpenModalQuotation(true);
                        }}
                        className="p-2 xl:p-3 gap-1 xl:gap-2"
                      >
                        <GoPlus className="h-4 w-4" />
                        <p className="hidden lg:block">
                          Tạo báo giá & đề xuất bảo trì
                        </p>
                      </Button>
                    )}
                  </Access>
                </div>
              ))
            ) : (
              <span>Chưa có đánh giá</span>
            ),
          span: 2,
        },
        {
          label: "Kiểm tra mục",
          children:
            data?.itemChecks?.length > 0 ? (
              data?.itemChecks?.map((x) => (
                <a
                  key={x?.id}
                  onClick={async () => {
                    const res = await callGetItemCheck(x?.id);
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {x?.checkName} <br />
                </a>
              ))
            ) : (
              <span>Chưa có kiểm tra mục</span>
            ),
          span: 2,
        },
      ];
    } else if (data?.description) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        {
          label: "Mô tả",
          children: data?.description || "N/A",
          span: 2,
        },
      ];
    } else if (data?.systemName) {
      return [
        { label: "Tên", children: data?.systemName || "N/A", span: 2 },
        { label: "Mô tả", children: data?.description || "N/A", span: 2 },
        {
          label: "Chu kỳ bảo trì",
          children: data?.maintenanceCycle || "N/A",
          span: 2,
        },
      ];
    } else if (data?.fileName) {
      return [
        {
          label: "Khách hàng",
          children: data?.customer?.companyName ? (
            <a
              onClick={async () => {
                const res = await callGetCustomer(data?.customer?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.customer?.companyName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Tổng số tiền",
          children: data?.totalAmount
            ? data?.totalAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : 0,
          span: 2,
        },
        {
          label: "Ngày bắt đầu",
          children: dayjs(data?.startDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Ngày kết thúc",
          children: dayjs(data?.endDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "File hợp đồng",
          children:
            (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
                  data?.fileName
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children: (
            <span
              className={`${
                data?.leaseStatus === "Active"
                  ? "success"
                  : data?.leaseStatus === "Inactive"
                  ? "danger"
                  : "warning"
              } status`}
            >
              {data?.leaseStatus === "Active"
                ? "Hoạt động"
                : data?.leaseStatus === "Inactive"
                ? "Đã chấm dứt"
                : "Đang chờ gia hạn"}
            </span>
          ),
          span: 2,
        },
      ];
    } else if (data?.role?.name) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Email", children: data?.email || "N/A", span: 2 },
        { label: "Điện thoại", children: data?.mobile || "N/A" },
        { label: "Vai trò", children: data?.role?.name || "N/A" },
        {
          label: "Trạng thái",
          children:
            (
              <span className={`${data?.status ? "success" : "danger"} status`}>
                {data?.status ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.typeName) {
      return [
        { label: "Tên", children: data?.typeName || "N/A", span: 2 },
        {
          label: "Hồ sơ",
          children:
            data?.customerTypeDocuments?.map((x) => (
              <p key={x?.id}>{x?.documentType}</p>
            )) || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span className={`${data?.status ? "success" : "danger"} status`}>
                {data?.status ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.assessmentDate) {
      return [
        {
          label: "Lịch sử bảo trì",
          children: data?.maintenanceHistory?.performedDate ? (
            <a
              onClick={async () => {
                const res = await callGetMaintenanceHistory(
                  data?.maintenanceHistory?.id
                );
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.maintenanceHistory?.performedDate || "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Tên thiết bị",
          children: data?.device?.deviceName ? (
            <a
              onClick={async () => {
                const res = await callGetDevice(data?.device?.deviceId);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.device?.deviceName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Nhà thầu phụ",
          children: data?.contractor?.name ? (
            <a
              onClick={async () => {
                const res = await callGetSubcontract(data?.contractor?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.contractor?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Xác xuất rủi ro",
          children: data?.riskProbability || "N/A",
          span: 2,
        },
        {
          label: "Tác động rủi ro",
          children: data?.riskImpact || "N/A",
          span: 2,
        },
        {
          label: "Phát hiện rủi ro",
          children: data?.riskDetection || "N/A",
          span: 2,
        },
        {
          label: "Số ưu tiên rủi ro",
          children: data?.riskPriorityNumber || "N/A",
          span: 2,
        },
        {
          label: "Hành động giảm thiểu",
          children: data?.mitigationAction || "N/A",
          span: 2,
        },
        {
          label: "Nhận xét",
          children: data?.remarks || "N/A",
          span: 2,
        },
        {
          label: "Ngày đánh giá",
          children:
            dayjs(data?.assessmentDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.performedDate) {
      return [
        {
          label: "Dịch vụ bảo trì",
          children: data?.maintenanceService?.serviceType ? (
            <a
              onClick={async () => {
                const res = await callGetSystemMaintenanceService(
                  data?.maintenanceService?.id
                );
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.maintenanceService?.serviceType === "ELECTRICAL"
                ? "Hệ thống Điện"
                : data?.maintenanceService?.serviceType === "PLUMBING"
                ? "Hệ thống Cấp thoát nước"
                : data?.maintenanceService?.serviceType === "HVAC"
                ? "Hệ thống Điều hòa không khí"
                : "Hệ thống Phòng cháy" || "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Ghi chú",
          children: data?.notes || "N/A",
          span: 2,
        },
        {
          label: "Vấn đề",
          children: data?.findings || "N/A",
          span: 2,
        },
        {
          label: "Giải pháp",
          children: data?.resolution || "N/A",
          span: 2,
        },
        {
          label: "Kỹ thuật viên",
          children: data?.technician?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.technician?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.technician?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Số điện thoại khác",
          children: data?.phone || "N/A",
          span: 2,
        },
      ];
    } else if (data?.rentPrice) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        {
          label: "Hợp đồng",
          children: (
            <>
              {data?.contracts?.[0]?.customer?.companyName ? (
                <a
                  onClick={async () => {
                    const res = await callGetContract(data?.contracts?.[0]?.id);
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  Công ty - {data?.contracts?.[0]?.customer?.companyName}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
          span: 2,
        },
        {
          label: "Tổng diện tích",
          children: data?.totalArea + " m²" || "N/A",
          span: 2,
        },
        {
          label: "Giá thuê",
          children:
            data?.rentPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
          span: 2,
        },
        {
          label: "Phí dịch vụ",
          children:
            data?.serviceFee?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "N/A",
          span: 2,
        },
        { label: "Tọa độ bắt đầu x", children: data?.startX || 0 },
        { label: "Tọa độ bắt đầu y", children: data?.startY || 0 },
        { label: "Tọa độ kết thúc x", children: data?.endX || 0 },
        { label: "Tọa độ kết thúc y", children: data?.endY || 0 },
        {
          label: "Bản vẽ",
          children:
            (
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
                  data?.drawingFile
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem
              </a>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Đồng hồ đo",
          children: (
            <>
              {data?.meters?.[0]?.serialNumber ? (
                <a
                  onClick={async () => {
                    const res = await callGetMeter(data?.meters?.[0]?.id);
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {data?.meters?.[0]?.serialNumber}
                </a>
              ) : (
                "N/A"
              )}
            </>
          ),
          span: 2,
        },
        {
          label: "Tình trạng bàn giao",
          children: (
            <>
              {data?.handoverStatuses?.map((x) => (
                <div key={x?.id}>
                  <a
                    href={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/storage/handover_status/${x?.drawingFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortenFileName(x?.drawingFile, 10)}
                  </a>{" "}
                  -{" "}
                  <a
                    href={`${
                      import.meta.env.VITE_BACKEND_URL
                    }/storage/handover_status/${x?.equipmentFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortenFileName(x?.equipmentFile, 10)}
                  </a>
                </div>
              ))}
            </>
          ),
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span
                className={`${
                  data?.status === "ACTIV" ? "success" : "danger"
                } status`}
              >
                {data?.status === "ACTIV" ? "Hoạt động" : "Không hoạt động"}
              </span>
            ) || "N/A",
          span: 2,
        },
      ];
    } else if (data?.contractEndDate) {
      return [
        { label: "Tên", children: data?.name || "N/A", span: 2 },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        {
          label: "Rating",
          children: (
            <Rate value={data?.rating} disabled style={{ fontSize: 16 }} />
          ),
          span: 2,
        },
        {
          label: "Hệ thống",
          children: data?.system?.systemName || "N/A",
          span: 2,
        },
        { label: "Ngày bắt đầu", children: data?.contractStartDate || "N/A" },
        { label: "Ngày kết thúc", children: data?.contractEndDate || "N/A" },
      ];
    } else if (data?.companyName) {
      return [
        { label: "Công ty", children: data?.companyName || "N/A", span: 2 },
        { label: "Giám đốc", children: data?.directorName || "N/A", span: 2 },
        { label: "Email", children: data?.email || "N/A" },
        { label: "Điện thoại", children: data?.phone || "N/A" },
        { label: "Địa chỉ", children: data?.address || "N/A", span: 2 },
        {
          label: "Ngày sinh",
          children: data?.birthday
            ? dayjs(data?.birthday).format("YYYY-DD-MM")
            : "N/A",
          span: 2,
        },
        {
          label: "Liên hệ",
          children: data?.user?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.user?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.user?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Loại khách hàng",
          children: data?.customerType?.typeName ? (
            <a
              onClick={async () => {
                const res = await callGetCustomerType(data?.customerType?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.customerType?.typeName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Hồ sơ",
          children: (
            <Steps
              direction="vertical"
              size="small"
              current={1}
              items={
                data?.customerType?.customerTypeDocuments?.map((x) => {
                  const filePath = x?.customerDocuments?.[0]?.filePath;
                  return {
                    title: x?.documentType,
                    description: filePath ? (
                      <a
                        href={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/storage/customer_documents/${filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem
                      </a>
                    ) : (
                      <span style={{ color: "red" }}>Đang thiếu</span>
                    ),
                    status: filePath ? "finish" : "error",
                  };
                }) || []
              }
            />
          ),
          span: 2,
        },
      ];
    } else if (data?.nextScheduledDate) {
      return [
        {
          label: "Dịch vụ",
          children:
            data?.serviceType === "ELECTRICAL"
              ? "Hệ thống Điện"
              : data?.serviceType === "PLUMBING"
              ? "Hệ thống Cấp thoát nước"
              : data?.serviceType === "FIRE_PROTECTION"
              ? "Hệ thống Phòng cháy"
              : data?.serviceType === "HVAC"
              ? "Hệ thống Điều hòa không khí"
              : "N/A",
          span: 2,
        },
        {
          label: "Phạm vi",
          children: data?.maintenanceScope || "N/A",
          span: 2,
        },
        {
          label: "Tần suất",
          children:
            data?.frequency === "MONTHLY"
              ? "Hàng tháng"
              : data?.frequency === "QUARTERLY"
              ? "Hàng quý"
              : data?.frequency === "ANNUALLY"
              ? "Hàng năm"
              : "N/A",
          span: 2,
        },
        {
          label: "Ngày dự kiến",
          children:
            dayjs(data?.nextScheduledDate).format("YYYY-MM-DD") || "N/A",
          span: 2,
        },
        {
          label: "Trạng thái",
          children:
            (
              <span
                className={`${
                  data?.status === "COMPLETED"
                    ? "success"
                    : data?.status === "PENDING"
                    ? "danger"
                    : "warning"
                } status`}
              >
                {data?.status === "COMPLETED"
                  ? "Hoàn thành"
                  : data?.status === "PENDING"
                  ? "Chưa giải quyết"
                  : "Đang tiến hành"}
              </span>
            ) || "N/A",
          span: 2,
        },
        {
          label: "Nhà thầu phụ",
          children: data?.subcontractor?.name ? (
            <a
              onClick={async () => {
                const res = await callGetSubcontract(data?.subcontractor?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.subcontractor?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ];
    } else if (data?.checkName) {
      return [
        {
          label: "Tên mục kiểm tra",
          children: data?.checkName || "N/A",
          span: 2,
        },
        {
          label: "Danh mục kiểm tra",
          children: data?.checkCategory || "N/A",
          span: 2,
        },
        {
          label: "Tiêu chuẩn kiểm tra",
          children: data?.standard || "N/A",
          span: 2,
        },
        {
          label: "Tần suất",
          children:
            data?.frequency === "HÀNG_NGÀY"
              ? "Hàng ngày"
              : data?.frequency === "HÀNG_TUẦN"
              ? "Hàng tuần"
              : data?.frequency === "HÀNG_THÁNG"
              ? "Hàng tháng"
              : data?.frequency === "HÀNG_QUÝ"
              ? "Hàng quý"
              : data?.frequency === "HÀNG_NĂM"
              ? "Hàng năm"
              : "N/A",
          span: 2,
        },
        {
          label: "Kết quả kiểm tra",
          children:
            data?.itemCheckResults?.length > 0 ? (
              data?.itemCheckResults?.map((x) => (
                <a
                  key={x?.id}
                  onClick={async () => {
                    const res = await callGetResultCheck(x?.id);
                    if (res?.data) {
                      handleViewDetail(res?.data);
                    }
                  }}
                >
                  {x?.result} <br />
                </a>
              ))
            ) : (
              <span>Chưa có kết quả</span>
            ),
          span: 2,
        },
      ];
    } else if (data?.note) {
      return [
        {
          label: "Tên mục kiểm tra",
          children: data?.itemCheck?.checkName ? (
            <a
              onClick={async () => {
                const res = await callGetItemCheck(data?.itemCheck?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.itemCheck?.checkName}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Ghi chú",
          children: data?.note || "N/A",
          span: 2,
        },
        {
          label: "Nhân viên phụ trách",
          children: data?.technician?.name ? (
            <a
              onClick={async () => {
                const res = await callGetUser(data?.technician?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {data?.technician?.name}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
        {
          label: "Kết quả",
          children:
            data?.result === "ĐẠT"
              ? "Đạt"
              : data?.result === "KHÔNG_ĐẠT"
              ? "Không đạt"
              : data?.result === "CẦN_SỬA_CHỮA"
              ? "Cần sửa chữa"
              : "N/A",
          span: 2,
        },
        {
          label: "Thời gian kiểm tra",
          children: dayjs(data?.checkedAt).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
      ];
    } else {
      return [
        {
          label: "Serial Number",
          children: data?.serialNumber || "N/A",
          span: 2,
        },
        {
          label: "Loại đồng hồ",
          children:
            data?.meterType === "THREE_PHASE" ? "3 Phase" : "1 Phase" || "N/A",
          span: 2,
        },
        {
          label: "Ngày cài đặt",
          children:
            dayjs(data?.installationDate).format(FORMAT_DATE_DISPLAY) || "N/A",
          span: 2,
        },
        {
          label: "Văn phòng",
          children: data?.office?.name ? (
            <a
              onClick={async () => {
                const res = await callGetOffice(data?.office?.id);
                if (res?.data) {
                  handleViewDetail(res?.data);
                }
              }}
            >
              {`${data?.office?.name} - ${data?.office?.location?.floor}` ||
                "N/A"}
            </a>
          ) : (
            "N/A"
          ),
          span: 2,
        },
      ];
    }
  };

  let items = generateItems();

  if (user?.role?.name === "Application_Admin") {
    items = [
      ...items,
      {
        label: "Ngày tạo",
        span: 2,
        children:
          dayjs(data?.createdAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Ngày cập nhật",
        span: 2,
        children:
          dayjs(data?.updatedAt).format(FORMAT_DATE_TIME_DISPLAY) || "N/A",
      },
      {
        label: "Tạo bởi",
        span: 2,
        children: data?.createdBy || "N/A",
      },
      {
        label: "Cập nhật bởi",
        span: 2,
        children: data?.updatedBy || "N/A",
      },
    ];
  }

  return (
    <Drawer
      title={`${
        data?.deviceId
          ? "Thông tin thiết bị"
          : data?.checkName
          ? "Thông tin kiểm tra mục"
          : data?.result
          ? "Thông tin kết quả kiểm tra mục"
          : data?.description
          ? "Thông tin loại thiết bị"
          : data?.systemName
          ? "Thông tin hệ thống"
          : data?.contractEndDate
          ? "Thông tin nhà thầu phụ"
          : data?.fileName
          ? "Thông tin hợp đồng"
          : data?.companyName
          ? "Thông tin khách hàng"
          : data?.typeName
          ? "Thông tin loại khách hàng"
          : data?.role?.name
          ? "Thông tin liên hệ"
          : data?.assessmentDate
          ? "Thông tin đánh giá rủi ro"
          : data?.performedDate
          ? "Thông tin lịch sử bảo trì"
          : data?.nextScheduledDate
          ? "Thông tin dịch vụ bảo trì"
          : data?.rentPrice
          ? "Thông tin văn phòng"
          : "Thông tin đồng hồ đo"
      }`}
      onClose={onClose}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
      extra={
        <Space>
          {historyStack.length > 0 && (
            <Button onClick={goBack}>Quay lại</Button>
          )}

          <Access permission={ALL_PERMISSIONS.CONTRACTS.UPDATE} hideChildren>
            {isOffice && (
              <Button
                type="primary"
                onClick={async () => {
                  const res = await callGetContract(data?.contracts[0]?.id);
                  if (res?.data) {
                    setOpenViewDetail(false);
                    setData(res?.data);
                    setOpenModal(res?.data);
                  }
                }}
              >
                <CiEdit className="h-4 w-4" />
                <p className="hidden lg:block">Chỉnh sửa</p>
              </Button>
            )}
          </Access>

          <Access permission={ALL_PERMISSIONS.DEVICES.UPDATE} hideChildren>
            {isDevice && (
              <Button
                type="primary"
                onClick={async () => {
                  const res = await callGetDevice(data?.deviceId);
                  if (res?.data) {
                    setOpenViewDetail(false);
                    setData(res?.data);
                    setOpenModalDevice(res?.data);
                  }
                }}
              >
                <CiEdit className="h-4 w-4" />
                <p className="hidden lg:block">Chỉnh sửa</p>
              </Button>
            )}
          </Access>

          <Access
            permission={ALL_PERMISSIONS.MAINTENANCE_HISTORIES.CREATE}
            hideChildren
          >
            {isDevice && (
              <Button
                onClick={() => {
                  setOpenViewDetail(false);
                  setData({ deviceId: data?.deviceId });
                  setOpenModalMaintenanceHistory(true);
                }}
                className="p-2 xl:p-3 gap-1 xl:gap-2"
              >
                <GoPlus className="h-4 w-4" />
                <p className="hidden lg:block">
                  Tạo lịch sử bảo trì và đánh giá rủi ro
                </p>
              </Button>
            )}
          </Access>
        </Space>
      }
    >
      <Descriptions
        items={items}
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        bordered
      />
    </Drawer>
  );
};

export default ViewOffice;
