import dayjs from "dayjs";
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  message,
  notification,
  Row,
  Select,
  Steps,
  Tooltip,
} from "antd";
import { FORMAT_DATE_DISPLAY } from "../../../../utils/constant";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { callConfirmationContract } from "../../../../services/api";

const ViewCustomerContract = (props) => {
  const { user, data, setData, openViewDetail, setOpenViewDetail, fetchData } =
    props;
  const [inputValues, setInputValues] = useState({});

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const [checkedInfos, setCheckedInfos] = useState({
    startDate: true,
    endDate: true,
    totalAmount: true,
    fileName: true,
    office: {
      name: true,
      location: { floor: true },
      totalArea: true,
      rentPrice: true,
      serviceFee: true,
      drawingFile: true,
    },
    customer: {
      companyName: true,
      directorName: true,
      birthday: true,
      email: true,
      phone: true,
      address: true,
      user: {
        name: true,
        email: true,
        mobile: true,
      },
      documents: [],
    },
  });

  useEffect(() => {
    if (data?.customer?.customerType?.customerTypeDocuments) {
      const initialDocuments =
        data.customer.customerType.customerTypeDocuments.map((doc) => ({
          docId: doc.id,
          checked: true,
        }));
      setCheckedInfos((prev) => ({
        ...prev,
        customer: { ...prev.customer, documents: initialDocuments },
      }));
    }
  }, [data?.customer?.customerType?.customerTypeDocuments]);

  const handleCheckboxChangeDoc = (docId, checked) => {
    setCheckedInfos((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        documents: prev.customer.documents.map((item) =>
          item.docId === docId ? { ...item, checked } : item
        ),
      },
    }));
  };

  const handleInputChange = (keys, e) => {
    const { value } = e.target;
    setInputValues((prevState) => {
      const updatedInputValues = { ...prevState };
      const keyArray = keys.split(".");
      let currentObj = updatedInputValues;

      for (let i = 0; i < keyArray.length - 1; i++) {
        const key = keyArray[i];
        if (!currentObj[key] || typeof currentObj[key] !== "object") {
          currentObj[key] = {};
        }
        currentObj = currentObj[key];
      }

      currentObj[keyArray[keyArray.length - 1]] = value;
      return updatedInputValues;
    });
  };

  const handleCheckboxChange = (keys, checked) => {
    setCheckedInfos((prevState) => {
      const updatedCheckedInfos = { ...prevState };
      const keyArray = keys.split(".");

      let currentObj = updatedCheckedInfos;
      keyArray.forEach((key, index) => {
        if (index === keyArray.length - 1) {
          currentObj[key] = checked;
        } else {
          if (!currentObj[key]) currentObj[key] = {};
          currentObj = currentObj[key];
        }
      });

      return updatedCheckedInfos;
    });
  };

  const getUpdatedValue = (keys, data) => {
    const keyArray = keys.split(".");
    let value = data;
    keyArray.forEach((key) => {
      if (value) {
        value = value[key];
      }
    });
    return value;
  };

  const contracts = [
    {
      label: "Ngày bắt đầu",
      children: (
        <div
          className={`flex ${
            !checkedInfos["startDate"] ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {dayjs(data?.startDate).format(FORMAT_DATE_DISPLAY)}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos["startDate"] ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos["startDate"] || false}
                    onChange={(e) =>
                      handleCheckboxChange("startDate", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos["startDate"] && (
                  <Input
                    id="startDate"
                    value={inputValues["startDate"]}
                    onChange={(e) => handleInputChange("startDate", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Ngày kết thúc",
      children: (
        <div
          className={`flex ${
            !checkedInfos["endDate"] ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {dayjs(data?.endDate).format(FORMAT_DATE_DISPLAY)}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${checkedInfos["endDate"] ? "Incorrect" : "Correct"}`}
                >
                  <Checkbox
                    checked={checkedInfos["endDate"] || false}
                    onChange={(e) =>
                      handleCheckboxChange("endDate", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos["endDate"] && (
                  <Input
                    id="endDate"
                    value={inputValues["endDate"]}
                    onChange={(e) => handleInputChange("endDate", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Tổng số tiền",
      children: (
        <div
          className={`flex ${
            !checkedInfos["totalAmount"] ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.totalAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos["totalAmount"] ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos["totalAmount"] || false}
                    onChange={(e) =>
                      handleCheckboxChange("totalAmount", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos["totalAmount"] && (
                  <Input
                    id="totalAmount"
                    value={inputValues["totalAmount"]}
                    onChange={(e) => handleInputChange("totalAmount", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "File hợp đồng",
      children: (
        <div
          className={`flex ${
            !checkedInfos["fileName"] ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.fileName ? (
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
                data?.fileName
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem
            </a>
          ) : (
            "Chưa có"
          )}

          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos["fileName"] ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos["fileName"] || false}
                    onChange={(e) =>
                      handleCheckboxChange("fileName", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.drawingFile && (
                  <Input
                    id="fileName"
                    value={inputValues["fileName"]}
                    onChange={(e) => handleInputChange("fileName", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Tình trạng hợp đồng",
      children: (
        <span
          className={`${
            data?.leaseStatus === "Active"
              ? "success"
              : data?.leaseStatus === "Inactive"
              ? "danger"
              : data?.leaseStatus === "Wait"
              ? "warning"
              : data?.leaseStatus === "Pending"
              ? "bg-gray-200"
              : data?.leaseStatus === "Corrected"
              ? "bg-gray-200"
              : data?.leaseStatus === "W_Confirmation"
              ? "bg-red-500 text-white"
              : data?.leaseStatus === "Send"
              ? "bg-green-500 text-white"
              : data?.leaseStatus === "W_Confirmation_2"
              ? "bg-red-500 text-white"
              : data?.leaseStatus === "Rejected"
              ? "bg-red-700 text-white"
              : data?.leaseStatus === "Approved"
              ? "bg-blue-950 text-white"
              : ""
          } status`}
        >
          {data?.leaseStatus === "Active"
            ? "Hoạt động"
            : data?.leaseStatus === "Inactive"
            ? "Đã chấm dứt"
            : data?.leaseStatus === "Wait"
            ? "Đang chờ gia hạn"
            : data?.leaseStatus === "Pending"
            ? "Đang chờ xử lý"
            : data?.leaseStatus === "Corrected"
            ? "Đã sửa"
            : data?.leaseStatus === "Send"
            ? "Đã gửi hợp đồng"
            : data?.leaseStatus === "W_Confirmation"
            ? "Đang chờ xác nhận"
            : data?.leaseStatus === "W_Confirmation_2"
            ? "Đang chờ xác nhận lần 2"
            : data?.leaseStatus === "Rejected"
            ? "Từ chối"
            : data?.leaseStatus === "Approved"
            ? "Chấp nhận"
            : ""}
        </span>
      ),
    },
  ];

  const offices = [
    {
      label: "Văn phòng",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.name ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.office?.name}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.name ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.name || false}
                    onChange={(e) =>
                      handleCheckboxChange("office.name", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.name && (
                  <Input
                    id="officeName"
                    value={inputValues?.office?.name || ""}
                    onChange={(e) => handleInputChange("office.name", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Vị trí",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.location?.floor ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.office?.location?.floor}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.location?.floor
                      ? "Incorrect"
                      : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.location?.floor || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "office.location.floor",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.location?.floor && (
                  <Input
                    id="office.location.floor"
                    value={inputValues["office.location.floor"]}
                    onChange={(e) =>
                      handleInputChange("office.location.floor", e)
                    }
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Tổng diện tích",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.totalArea ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.office?.totalArea + " m²"}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.totalArea ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.totalArea || false}
                    onChange={(e) =>
                      handleCheckboxChange("office.totalArea", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.totalArea && (
                  <Input
                    id="office.totalArea"
                    value={inputValues["office.totalArea"]}
                    onChange={(e) => handleInputChange("office.totalArea", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Chi phí thuê",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.rentPrice ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.office?.rentPrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.rentPrice ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.rentPrice || false}
                    onChange={(e) =>
                      handleCheckboxChange("office.rentPrice", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.rentPrice && (
                  <Input
                    id="office.rentPrice"
                    value={inputValues["office.rentPrice"]}
                    onChange={(e) => handleInputChange("office.rentPrice", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Chi phí dịch vụ",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.serviceFee ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.office?.serviceFee.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.serviceFee ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.serviceFee || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "office.serviceFee",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.serviceFee && (
                  <Input
                    id="office.serviceFee"
                    value={inputValues["office.serviceFee"]}
                    onChange={(e) => handleInputChange("office.serviceFee", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Bản vẽ",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.office?.drawingFile ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
              data?.office?.drawingFile
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem
          </a>
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.office?.drawingFile ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.office?.drawingFile || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "office.drawingFile",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.office?.drawingFile && (
                  <Input
                    id="office.drawingFile"
                    value={inputValues["office.drawingFile"]}
                    onChange={(e) => handleInputChange("office.drawingFile", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
  ];

  const customers = [
    {
      label: "Công ty",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.companyName ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.companyName}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.companyName
                      ? "Incorrect"
                      : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.companyName || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.companyName",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.companyName && (
                  <Input
                    id="customer.companyName"
                    value={inputValues["customer.companyName"]}
                    onChange={(e) =>
                      handleInputChange("customer.companyName", e)
                    }
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Giám đốc",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.directorName ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.directorName}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.directorName
                      ? "Incorrect"
                      : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.directorName || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.directorName",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.directorName && (
                  <Input
                    id="customer.directorName"
                    value={inputValues["customer.directorName"]}
                    onChange={(e) =>
                      handleInputChange("customer.directorName", e)
                    }
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Ngày sinh",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.birthday ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {dayjs(data?.customer?.birthday).format(FORMAT_DATE_DISPLAY)}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.birthday ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.birthday || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.birthday",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.birthday && (
                  <Input
                    id="customer.birthday"
                    value={inputValues["customer.birthday"]}
                    onChange={(e) => handleInputChange("customer.birthday", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "E-mail",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.email ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.email}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.email ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.email || false}
                    onChange={(e) =>
                      handleCheckboxChange("customer.email", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.email && (
                  <Input
                    id="customer.email"
                    value={inputValues["customer.email"]}
                    onChange={(e) => handleInputChange("customer.email", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Số điện thoại",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.phone ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.phone}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.phone ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.phone || false}
                    onChange={(e) =>
                      handleCheckboxChange("customer.phone", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.phone && (
                  <Input
                    id="customer.phone"
                    value={inputValues["customer.phone"]}
                    onChange={(e) => handleInputChange("customer.phone", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Địa chỉ",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.address ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.address}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.address ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.address || false}
                    onChange={(e) =>
                      handleCheckboxChange("customer.address", e.target.checked)
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.address && (
                  <Input
                    id="customer.address"
                    value={inputValues["customer.address"]}
                    onChange={(e) => handleInputChange("customer.address", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Hồ sơ",
      children: (
        <Steps
          direction="vertical"
          size="small"
          current={1}
          items={
            data?.customer?.customerType?.customerTypeDocuments?.length > 0
              ? data?.customer?.customerType?.customerTypeDocuments?.map(
                  (x) => {
                    const filePath = x?.customerDocuments?.[0]?.filePath;
                    const documentId = x?.id;
                    const checkedInfo = checkedInfos.customer.documents.find(
                      (item) => item.docId === documentId
                    );

                    return {
                      title: x?.documentType,
                      description: (
                        <div
                          className={`flex ${
                            !checkedInfo?.checked ? "flex-col lg:flex-row" : ""
                          } items-center justify-between gap-2`}
                        >
                          {filePath ? (
                            <a
                              href={`$${
                                import.meta.env.VITE_BACKEND_URL
                              }/storage/customer_documents/${filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem
                            </a>
                          ) : (
                            <span style={{ color: "red" }}>Chưa có</span>
                          )}

                          {user?.role?.name === "Customer" &&
                            (data?.leaseStatus === "W_Confirmation" ||
                              data?.leaseStatus === "W_Confirmation_2") && (
                              <Checkbox
                                checked={checkedInfo?.checked || false}
                                onChange={(e) =>
                                  handleCheckboxChangeDoc(
                                    documentId,
                                    e.target.checked
                                  )
                                }
                              />
                            )}
                        </div>
                      ),
                      status: filePath ? "finish" : "error",
                    };
                  }
                )
              : [
                  {
                    description: "Chưa có",
                    status: "error",
                  },
                ]
          }
        />
      ),
    },
  ];

  const contacts = [
    {
      label: "Họ và tên",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.user?.name ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.user?.name}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.user?.name ? "Incorrect" : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.user?.name || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.user.name",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.user?.name && (
                  <Input
                    id="customer.user.name"
                    value={inputValues["customer.user.name"]}
                    onChange={(e) => handleInputChange("customer.user.name", e)}
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "E-mail",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.user?.email ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.user?.email}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.user?.email
                      ? "Incorrect"
                      : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.user?.email || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.user.email",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.user?.email && (
                  <Input
                    id="customer.user.email"
                    value={inputValues["customer.user.email"]}
                    onChange={(e) =>
                      handleInputChange("customer.user.email", e)
                    }
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
    {
      label: "Số điện thoại",
      children: (
        <div
          className={`flex ${
            !checkedInfos?.customer?.user?.mobile ? "flex-col lg:flex-row" : ""
          } items-center justify-between gap-2`}
        >
          {data?.customer?.user?.mobile}
          {user?.role?.name === "Customer" &&
            (data?.leaseStatus === "W_Confirmation" ||
              data?.leaseStatus === "W_Confirmation_2") && (
              <div className="flex items-center gap-2">
                <Tooltip
                  placement="topLeft"
                  title={`${
                    checkedInfos?.customer?.user?.mobile
                      ? "Incorrect"
                      : "Correct"
                  }`}
                >
                  <Checkbox
                    checked={checkedInfos?.customer?.user?.mobile || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "customer.user.mobile",
                        e.target.checked
                      )
                    }
                  />
                </Tooltip>
                {!checkedInfos?.customer?.user?.mobile && (
                  <Input
                    id="customer.user.mobile"
                    value={inputValues["customer.user.mobile"]}
                    onChange={(e) =>
                      handleInputChange("customer.user.mobile", e)
                    }
                    placeholder="Vui lòng kiểm tra kỹ các mục và cập nhật thông tin nếu có sai sót"
                  />
                )}
              </div>
            )}
        </div>
      ),
    },
  ];

  const labels = {
    startDate: "Ngày bắt đầu hợp đồng",
    endDate: "Ngày kết thúc hợp đồng",
    totalAmount: "Tổng số tiền",
    fileName: "File hợp đồng",

    office: {
      name: "Tên văn phòng",
      totalArea: "Tổng số tiền",
      rentPrice: "Chi phí thuê văn phòng",
      serviceFee: "Chi phí dịch vụ",
      drawingFile: "Bản vẽ văn phòng",
      location: {
        floor: "Vị trí văn phòng",
      },
    },

    customer: {
      companyName: "Công ty",
      directorName: "Giám đốc",
      birthday: "Ngày sinh",
      email: "E-mail",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      user: {
        name: "Tên người liên hệ",
        email: "E-mail người liên hệ",
        mobile: "Số điện thoại người liên hệ",
      },
      documents: {
        "Giấy chứng minh nhân dân 2 mặt": "Giấy chứng minh nhân dân 2 mặt",
        "Giấy đăng ký kinh doanh (đối với doanh nghiệp)":
          "Giấy đăng ký kinh doanh (đối với doanh nghiệp)",
        "Mã số thuế cá nhân hoặc doanh nghiệp":
          "Mã số thuế cá nhân hoặc doanh nghiệp",
      },
    },
  };

  function getDeepValue(obj, key) {
    const keys = key.split(".");
    let result = obj;
    for (const k of keys) {
      if (result && result.hasOwnProperty(k)) {
        result = result[k];
      } else {
        return undefined;
      }
    }
    return result;
  }

  const getDocumentUpdates = (customerDocuments, data, inputValues, labels) => {
    if (!customerDocuments) return [];

    return customerDocuments.reduce((docAcc, doc, index) => {
      if (!doc.checked) {
        const docType =
          data?.customer?.customerType?.customerTypeDocuments?.[index]
            ?.documentType;
        const documentLabel =
          getDeepValue(labels, `customer.documents.${docType}`) || docType;
        const inputKey = `customer.documents.${index}.checked`;
        docAcc.push(
          `${documentLabel}: ${
            inputValues[inputKey] ||
            getUpdatedValue(inputKey, data) ||
            "Không chính xác"
          }`
        );
      }
      return docAcc;
    }, []);
  };

  const handleReset = () => {
    setOpenViewDetail(false);
    setData(null);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    setIsSubmit(true);

    const res = await callConfirmationContract(
      data?.id,
      values?.status,
      values?.comment
    );

    if (res && res.data) {
      message.success(res.message);
      handleReset();
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
      });
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (form && checkedInfos && data && inputValues && labels) {
      const commentValue = Object.entries(checkedInfos)
        .reduce((acc, [key, value]) => {
          if (typeof value === "boolean" && !value) {
            acc.push(
              `${getDeepValue(labels, key) || key} : ${
                getDeepValue(inputValues, key) || getUpdatedValue(key, data)
              }`
            );
          } else if (typeof value === "object") {
            const nestedUpdates = Object.entries(value).reduce(
              (nestedAcc, [nestedKey, nestedValue]) => {
                if (typeof nestedValue === "boolean" && !nestedValue) {
                  const inputKey = `${key}.${nestedKey}`;
                  if (
                    getDeepValue(inputValues, inputKey) ||
                    getUpdatedValue(inputKey, data)
                  ) {
                    nestedAcc.push(
                      `${getDeepValue(labels, inputKey) || inputKey}: ${
                        getDeepValue(inputValues, inputKey) ||
                        getUpdatedValue(inputKey, data)
                      }`
                    );
                  }
                } else if (typeof nestedValue === "object") {
                  const doubleNestedUpdates = Object.entries(
                    nestedValue
                  ).reduce(
                    (doubleNestedAcc, [doubleNestedKey, doubleNestedValue]) => {
                      if (
                        typeof doubleNestedValue === "boolean" &&
                        !doubleNestedValue
                      ) {
                        const inputKey = `${key}.${nestedKey}.${doubleNestedKey}`;
                        if (
                          getDeepValue(inputValues, inputKey) ||
                          getUpdatedValue(inputKey, data)
                        ) {
                          doubleNestedAcc.push(
                            `${getDeepValue(labels, inputKey) || inputKey}: ${
                              getDeepValue(inputValues, inputKey) ||
                              getUpdatedValue(inputKey, data)
                            }`
                          );
                        }
                      }
                      return doubleNestedAcc;
                    },
                    []
                  );
                  nestedAcc.push(...doubleNestedUpdates);
                }
                return nestedAcc;
              },
              []
            );
            acc.push(...nestedUpdates);
          }
          return acc;
        }, [])
        .concat(
          getDocumentUpdates(
            checkedInfos?.customer?.documents,
            data,
            inputValues,
            labels
          )
        )
        .join("\n");

      form.setFieldsValue({ comment: commentValue });
    }
  }, [
    form,
    checkedInfos,
    data,
    inputValues,
    labels,
    getDeepValue,
    getUpdatedValue,
    getDocumentUpdates,
  ]);

  return (
    <Drawer
      title="Thông tin hợp đồng khách hàng"
      onClose={handleReset}
      open={openViewDetail}
      width={window.innerWidth > 900 ? 800 : window.innerWidth}
    >
      <h1 className="text-center uppercase font-semibold text-lg mb-5">
        Hợp đồng
      </h1>

      <Descriptions items={contracts} column={1} bordered />

      <h1 className="text-center uppercase font-semibold text-lg my-5">
        Văn phòng
      </h1>

      <Descriptions items={offices} column={1} bordered />

      <h1 className="text-center uppercase font-semibold text-lg my-5">
        Khách hàng
      </h1>

      <Descriptions items={customers} column={1} bordered />

      <h1 className="text-center uppercase font-semibold text-lg my-5">
        Người liên hệ
      </h1>

      <Descriptions items={contacts} column={1} bordered />

      {user?.role?.name === "Customer" &&
        (data?.leaseStatus === "W_Confirmation" ||
          data?.leaseStatus === "W_Confirmation_2") && (
          <Form
            name="send"
            onFinish={handleFinish}
            layout="vertical"
            form={form}
          >
            <Row gutter={16}>
              <h3 className="text-center uppercase font-semibold text-lg my-5">
                Phản hồi
              </h3>

              <Col xs={24}>
                <Form.Item label="Phản hồi" name="comment">
                  <TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                  ]}
                >
                  <Select
                    placeholder="Vui lòng chọn"
                    optionLabelProp="label"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Option value="Rejected" label="Từ chối">
                      Từ chối
                    </Option>
                    <Option value="Approved" label="Chấp nhận">
                      Chấp nhận
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              disabled={isSubmit}
              className="mt-2"
            >
              {isSubmit ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
    </Drawer>
  );
};

export default ViewCustomerContract;
