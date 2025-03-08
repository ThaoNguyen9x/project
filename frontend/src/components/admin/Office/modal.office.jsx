import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Upload,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  DatePicker,
  Checkbox,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  callCreateContract,
  callCreateCustomer,
  callCreateCustomerDocument,
  callCreateHandoverStatus,
  callCreateMeter,
  callCreateOffice,
  callCreateUser,
  callDeleteCustomer,
  callDeleteCustomerDocument,
  callDeleteHandoverStatus,
  callDeleteMeter,
  callDeleteOffice,
  callDeleteUser,
  callUpdateContract,
  callUpdateCustomer,
  callUpdateCustomerDocument,
  callUpdateHandoverStatus,
  callUpdateMeter,
  callUpdateOffice,
  callUpdateUser,
} from "../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalOffice = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listLocations,
    listCustomerTypes,
    listCustomerTypeDocuments,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFileContract, setDataFileContract] = useState([]); // Contract
  const [dataFileOffice, setDataFileOffice] = useState([]); // Office
  const [dataDrawing, setDataDrawing] = useState([]); // Handover Status
  const [dataEquipment, setDataEquipment] = useState([]); // Handover Status
  const [dataFileDocument, setDataFileDocument] = useState({}); // Customer Document
  const [handoverList, setHandoverList] = useState([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState(null);
  const [checkedDocuments, setCheckedDocuments] = useState({});

  useEffect(() => {
    if (data?.id) {
      const handover = data?.office?.handoverStatuses?.[0] || null;

      const init = {
        ...data,
        location: data?.office?.location?.id || null,
        statusOffice: data?.office?.status || null,
        name: data?.office?.name || null,
        rentPrice: data?.office?.rentPrice || null,
        serviceFee: data?.office?.serviceFee || null,
        startX: data?.office?.startX || 0,
        startY: data?.office?.startY || 0,
        endX: data?.office?.endX || 0,
        endY: data?.office?.endY || 0,
        drawingFile: data?.office?.drawingFile || null,

        serialNumber: data?.office?.meters?.[0]?.serialNumber || null,
        meterType: data?.office?.meters?.[0]?.meterType || null,

        handover: handover?.handover || null,
        statusHandover: handover?.status || null,

        customerType: data?.customer?.customerType?.id || null,
        statusCustomer: data?.customer?.status || null,
        companyName: data?.customer?.companyName || null,
        directorName: data?.customer?.directorName || null,
        email: data?.customer?.email || null,
        phone: data?.customer?.phone || null,
        address: data?.customer?.address || null,
        user: data?.customer?.user?.id || null,
        birthday: data?.customer?.birthday
          ? dayjs(data?.customer?.birthday)
          : null,

        startDate: data?.startDate ? dayjs(data?.startDate) : null,
        endDate: data?.endDate ? dayjs(data?.endDate) : null,
        leaseStatus: data?.leaseStatus || null,
        fileName: data?.fileName || null,

        nameUser: data?.customer?.user?.name || null,
        emailUser: data?.customer?.user?.email || null,
        mobile: data?.customer?.user?.mobile || null,
        role: data?.customer?.user?.role?.id || null,
        statusUser: data?.customer?.user?.status ? "true" : "false",
      };

      if (data?.fileName) {
        setDataFileContract([
          {
            uid: "-1",
            name: data?.fileName,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
              data?.fileName
            }`,
          },
        ]);
      }

      if (data?.office?.drawingFile) {
        setDataFileOffice([
          {
            uid: "-1",
            name: data?.office?.drawingFile,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
              data?.office?.drawingFile
            }`,
          },
        ]);
      }

      const customerDocuments =
        data?.customer?.customerType?.customerTypeDocuments?.reduce(
          (acc, doc) => {
            acc[doc.id] = doc.customerDocuments
              ? doc.customerDocuments.map((custDoc) => ({
                  uid: `-${custDoc.id}`,
                  name: custDoc.filePath,
                  status: "done",
                  url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/storage/customer_documents/${custDoc.filePath}`,
                  originFileObj: null,
                }))
              : [];
            return acc;
          },
          {}
        );

      setDataFileDocument(customerDocuments);

      setHandoverList(
        data?.office?.handoverStatuses?.map((handover) => ({
          id: handover.id,
          equipmentFile: handover.equipmentFile
            ? [
                {
                  uid: `-${handover.id}`,
                  name: handover.equipmentFile,
                  status: "done",
                  url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/storage/handover_status/${handover.equipmentFile}`,
                },
              ]
            : [],
          drawingFile: handover.drawingFile
            ? [
                {
                  uid: `-${handover.id}`,
                  name: handover.drawingFile,
                  status: "done",
                  url: `${
                    import.meta.env.VITE_BACKEND_URL
                  }/storage/handover_status/${handover.drawingFile}`,
                },
              ]
            : [],
        }))
      );

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    try {
      let resOffice;
      let resUser;
      let resCustomer;
      let resContract;
      let resMeter;

      if (!data?.id) {
        resOffice = await callCreateOffice(
          values.name,
          values.location,
          values.rentPrice,
          values.serviceFee,
          values.startX,
          values.startY,
          values.endX,
          values.endY,
          values.statusOffice,
          dataFileOffice.length > 0
            ? dataFileOffice[0].originFileObj || dataFileOffice[0].url
            : null
        );

        if (!resOffice || !resOffice.data) {
          throw new Error(resOffice?.error);
        }

        resMeter = await callCreateMeter(
          values.serialNumber,
          values.meterType,
          {
            id: resOffice.data.id,
          }
        );

        if (!resMeter || !resMeter.data) {
          await callDeleteOffice(resOffice.data.id);
          throw new Error(resMeter?.error);
        }

        resUser = await callCreateUser(
          values.nameUser,
          values.emailUser,
          values.mobile,
          values.password,
          values.statusUser,
          {
            id: (values.role = 8),
          }
        );

        if (!resUser || !resUser.data) {
          await callDeleteOffice(resOffice.data.id);
          throw new Error(resUser?.error);
        }

        resCustomer = await callCreateCustomer(
          values.companyName,
          { id: values.customerType },
          values.email,
          values.phone,
          values.address,
          values.statusCustomer,
          values.directorName,
          values.birthday
            ? dayjs(values.birthday).startOf("day").format("YYYY-MM-DD")
            : null,
          { id: resUser.data.id }
        );

        if (!resCustomer || !resCustomer.data) {
          await callDeleteOffice(resOffice.data.id);
          throw new Error(resCustomer?.error);
        }

        const selectedDocIds = Object.keys(checkedDocuments).filter(
          (key) => checkedDocuments[key]
        );

        selectedDocIds.forEach(async (docId) => {
          await callCreateCustomerDocument(
            resCustomer.data.id,
            docId,
            dataFileDocument.length > 0
              ? dataFileDocument[0].originFileObj || dataFileDocument[0].url
              : null,
            true
          );
        });

        resContract = await callCreateContract(
          values.startDate
            ? dayjs(values.startDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.endDate
            ? dayjs(values.endDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.leaseStatus,
          resOffice.data.id,
          resCustomer.data.id,
          dataFileContract.length > 0
            ? dataFileContract[0].originFileObj || dataFileContract[0].url
            : null
        );

        if (!resContract || !resContract.data) {
          await callDeleteOffice(resOffice.data.id);
          throw new Error(resContract?.error);
        }
      } else {
        resUser = await callUpdateUser(
          data?.customer?.user?.id,
          values.nameUser,
          values.emailUser,
          values.mobile,
          values.statusUser,
          {
            id: (values.role = 8),
          }
        );

        if (!resUser || !resUser.data) {
          throw new Error(resUser?.error);
        }

        resOffice = await callUpdateOffice(
          data?.office?.id,
          values.name,
          values.location,
          values.rentPrice,
          values.serviceFee,
          values.startX,
          values.startY,
          values.endX,
          values.endY,
          values.statusOffice,
          dataFileOffice.length > 0
            ? dataFileOffice[0].originFileObj || dataFileOffice[0].url
            : null
        );

        if (!resOffice || !resOffice.data) {
          throw new Error(resOffice?.error);
        }

        resMeter = await callUpdateMeter(
          data?.office?.meters?.[0]?.id,
          values.serialNumber,
          values.meterType,
          {
            id: resOffice.data.id,
          }
        );

        if (!resMeter || !resMeter.data) {
          throw new Error(resMeter?.error);
        }

        resCustomer = await callUpdateCustomer(
          data?.customer?.id,
          values.companyName,
          { id: values.customerType },
          values.email,
          values.phone,
          values.address,
          values.statusCustomer,
          values.directorName,
          values.birthday
            ? dayjs(values.birthday).startOf("day").format("YYYY-MM-DD")
            : null,
          { id: resUser.data.id }
        );

        if (!resCustomer || !resCustomer.data) {
          throw new Error(resCustomer?.error);
        }

        const selectedDocIds = Object.keys(checkedDocuments).filter(
          (key) => checkedDocuments[key]
        );

        for (const typeId of selectedDocIds) {
          const documentType =
            data?.customer?.customerType?.customerTypeDocuments?.find(
              (doc) => doc.id == typeId
            );

          if (documentType?.customerDocuments?.length > 0) {
            for (const customerDoc of documentType.customerDocuments) {
              await callUpdateCustomerDocument(
                customerDoc.id,
                data?.customer?.id,
                typeId,
                dataFileDocument?.[typeId]?.[0]?.originFileObj || null,
                true
              );
            }
          } else {
            await callCreateCustomerDocument(
              data?.customer?.id,
              typeId,
              dataFileDocument?.[typeId]?.[0]?.originFileObj || null,
              true
            );
          }
        }

        resContract = await callUpdateContract(
          data?.id,
          values.startDate
            ? dayjs(values.startDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.endDate
            ? dayjs(values.endDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.leaseStatus,
          resOffice.data.id,
          resCustomer.data.id,
          dataFileContract.length > 0
            ? dataFileContract[0].originFileObj || dataFileContract[0].url
            : null
        );

        if (!resContract || !resContract.data) {
          throw new Error(resContract?.error);
        }
      }

      const handoversToCreate = handoverList.filter(
        (handover) => handover.id === null
      );
      const handoversToUpdate = handoverList.filter(
        (handover) => handover.id !== null
      );

      const createRequests = handoversToCreate.map((handover) =>
        callCreateHandoverStatus(
          values.statusHandover,
          resOffice.data.id,
          handover.equipmentFile?.length > 0
            ? handover.equipmentFile[0].originFileObj
            : null,
          handover.drawingFile?.length > 0
            ? handover.drawingFile[0].originFileObj
            : null
        )
      );

      const updateRequests = handoversToUpdate.map((handover) =>
        callUpdateHandoverStatus(
          handover.id,
          values.statusHandover,
          resOffice.data.id,
          handover.equipmentFile?.length > 0
            ? handover.equipmentFile[0].originFileObj
            : null,
          handover.drawingFile?.length > 0
            ? handover.drawingFile[0].originFileObj
            : null
        )
      );

      await Promise.all([...createRequests, ...updateRequests]);

      message.success("Thành công");
      fetchData();
      handleReset();
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          error?.response?.data?.message || error.message || "Đã xảy ra lỗi",
      });
    }
    setIsSubmit(false);
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";

    if (!isPdf) {
      message.error("Bạn chỉ có thể tải lên tệp PDF");
      setDataFileContract([]);
      setDataFileOffice([]);
      setDataEquipment([]);
      setDataDrawing([]);
    }

    return isPdf || Upload.LIST_IGNORE;
  };

  const handleReset = () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
    setDataFileContract([]);
    setDataFileOffice([]);
    setHandoverList([]);
    setCheckedDocuments([]);
    setSelectedCustomerType(null);
    setDataFileDocument({});
  };

  const addHandover = () => {
    setHandoverList((prevList) => [
      ...prevList,
      {
        id: null,
        equipmentFile: [],
        drawingFile: [],
      },
    ]);
  };

  const handleUploadChange = (fileList, index, type) => {
    setHandoverList((prev) =>
      prev.map((handover, i) =>
        i === index ? { ...handover, [type]: fileList } : handover
      )
    );
  };

  const handleRemoveHandover = (handover) => {
    if (!handover.id) {
      setHandoverList((prevList) =>
        prevList.filter((item) => item !== handover)
      );
    } else {
      Modal.confirm({
        title: "Xác nhận xóa?",
        content: "Bạn có chắc chắn muốn xóa không?",
        okText: "Có",
        cancelText: "Không",
        onOk: () => handleDeleteHandoverStatus(handover.id),
      });
    }

    setDataDrawing([]);
    setDataEquipment([]);
  };

  const handleDeleteHandoverStatus = async (id) => {
    const res = await callDeleteHandoverStatus(id);

    if (res?.statusCode === 200) {
      message.success(res.message);
      setHandoverList((prevList) => prevList.filter((item) => item.id !== id));
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
      });
    }
  };

  const handleCheckboxChange = (docId, checked) => {
    setCheckedDocuments((prev) => ({
      ...prev,
      [docId]: checked,
    }));
  };

  useEffect(() => {
    if (dataFileDocument) {
      const newCheckedDocuments = {};
      Object.keys(dataFileDocument).forEach((docId) => {
        if (dataFileDocument[docId]?.length > 0) {
          newCheckedDocuments[docId] = true;
        }
      });
      setCheckedDocuments(newCheckedDocuments);

      if (data?.customer?.customerType?.id) {
        setSelectedCustomerType(data.customer.customerType.id);
      }
    }
  }, [dataFileDocument, data]);

  return (
    <Modal
      forceRender
      title={
        data?.id ? "Cập nhật hợp đồng khách hàng" : "Tạo hợp đồng khách hàng"
      }
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <h3 className="font-semibold text-base my-2">Thông tin khách hàng</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Công ty"
              name="companyName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Giám đốc"
              name="directorName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { type: "email", message: "Email không hợp lệ" },
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không được để trống",
                },
                {
                  pattern: new RegExp(
                    /^(\+?[0-9]{1,4})?(\(?\d{3}\)?[\s.-]?)?[\d\s.-]{7,}$/
                  ),
                  message:
                    "Vui lòng nhập số điện thoại hợp lệ (ví dụ: (123) 456-7890 hoặc +1234567890)",
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.isBefore(new Date(), "day")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Ngày sinh không được lớn hơn ngày hiện tại")
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                className="w-full"
                disabledDate={(current) =>
                  current && current.isAfter(new Date(), "day")
                }
              />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Loại khách hàng"
              name="customerType"
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
                onChange={(value) => setSelectedCustomerType(value)}
              >
                {listCustomerTypes
                  ?.filter((customerType) => customerType.status)
                  .map((customerType) => (
                    <Select.Option
                      key={customerType.id}
                      value={customerType.id}
                      label={customerType.typeName}
                    >
                      {customerType.typeName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          {selectedCustomerType && listCustomerTypeDocuments.length > 0 && (
            <Col xs={24}>
              <h3>Danh sách hồ sơ yêu cầu:</h3>

              <ul className="my-2">
                {listCustomerTypeDocuments
                  ?.filter((doc) => {
                    return (
                      doc.customerType.id === selectedCustomerType && doc.status
                    );
                  })
                  ?.map((doc) => (
                    <li key={doc.id}>
                      <Checkbox
                        checked={checkedDocuments?.[doc.id] || false}
                        onChange={(e) =>
                          handleCheckboxChange(doc.id, e.target.checked)
                        }
                      >
                        {doc.documentType}
                      </Checkbox>

                      {checkedDocuments?.[doc.id] && (
                        <Form.Item name="filePath">
                          <Upload
                            name="filePath"
                            beforeUpload={beforeUpload}
                            onChange={({ fileList }) => {
                              setDataFileDocument((prev) => ({
                                ...prev,
                                [doc.id]: fileList,
                              }));
                            }}
                            fileList={
                              doc.id && dataFileDocument?.[doc.id]
                                ? dataFileDocument[doc.id]
                                : []
                            }
                            maxCount={1}
                            accept=".pdf"
                            listType="text"
                          >
                            {!dataFileDocument?.[doc.id]?.length && (
                              <Button icon={<UploadOutlined />}>
                                Bấm để tải lên
                              </Button>
                            )}
                          </Upload>
                        </Form.Item>
                      )}
                    </li>
                  ))}
              </ul>
            </Col>
          )}

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="statusCustomer"
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
                  <Option value="ACTIV" label="Hoạt động">
                    Hoạt động
                  </Option>
                  <Option value="UNACTIV" label="Không hoạt động">
                    Không hoạt động
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <h3 className="font-semibold text-base my-2">Thông tin liên hệ</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Họ và tên"
              name="nameUser"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="E-mail"
              name="emailUser"
              rules={[
                { type: "email", message: "E-mail không hợp lệ" },
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Điện thoại"
              name="mobile"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không được để trống",
                },
                {
                  pattern: new RegExp(
                    /^(\+?[0-9]{1,4})?(\(?\d{3}\)?[\s.-]?)?[\d\s.-]{7,}$/
                  ),
                  message:
                    "Vui lòng nhập số điện thoại hợp lệ (ví dụ: (123) 456-7890 hoặc +1234567890)",
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          {data?.id ? (
            ""
          ) : (
            <>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                  ]}
                >
                  <Input.Password autoComplete="off" value={"1"} />
                </Form.Item>
              </Col>
            </>
          )}

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="statusUser"
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
                  <Option value="true" label="Hoạt động">
                    Hoạt động
                  </Option>
                  <Option value="false" label="Không hoạt động">
                    Không hoạt động
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <h3 className="font-semibold text-base my-2">Thông tin hợp đồng</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item label="File hợp đồng" name="fileName">
              <Upload
                name="fileName"
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => {
                  setDataFileContract(fileList);
                }}
                fileList={dataFileContract}
                maxCount={1}
                accept=".pdf"
                listType="text"
              >
                {dataFileContract.length < 1 ? (
                  <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                ) : null}
              </Upload>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              dependencies={["startDate"]}
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("startDate");
                    if (
                      !value ||
                      !startDate ||
                      value.isAfter(startDate, "day")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu")
                    );
                  },
                }),
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="leaseStatus"
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
                  <Option value="Active" label="Hoạt động">
                    Hoạt động
                  </Option>
                  <Option value="Rejected" label="Từ chối">
                    Từ chối
                  </Option>
                  <Option value="Approved" label="Chấp thuận">
                    Chấp thuận
                  </Option>
                  <Option value="Send" label="Đã gửi hợp đồng">
                    Đã gửi hợp đồng
                  </Option>
                  <Option value="Wait" label="Đang chờ gia hạn">
                    Đang chờ gia hạn
                  </Option>
                  <Option value="Inactive" label="Đã chấm dứt">
                    Đã chấm dứt
                  </Option>
                  <Option value="Corrected" label="Đã sửa">
                    Đã sửa
                  </Option>
                  <Option value="W_Confirmation" label="Đang chờ xác nhận">
                    Đang chờ xác nhận
                  </Option>
                  <Option
                    value="W_Confirmation_2"
                    label="Đang chờ xác nhận lần 2"
                  >
                    Đang chờ xác nhận lần 2
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <h3 className="font-semibold text-base my-2">Thông tin văn phòng</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Vị trí"
              name="location"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listLocations.map((location) => (
                  <Select.Option
                    key={location.id}
                    value={location.id}
                    label={location.floor}
                  >
                    {location.floor}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Bản vẽ"
              name="drawingFile"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Upload
                name="drawingFile"
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => setDataFileOffice(fileList)}
                fileList={dataFileOffice}
                maxCount={1}
                accept=".pdf"
                listType="text"
              >
                {dataFileOffice.length < 1 ? (
                  <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                ) : null}
              </Upload>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ bắt đầu X"
              name="startX"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ bắt đầu Y"
              name="startY"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ kết thúc X"
              name="endX"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ kết thúc Y"
              name="endY"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Giá thuê"
              name="rentPrice"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không được để trống",
                },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input prefix="$" suffix="USD" autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Phí dịch vụ"
              name="serviceFee"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không được để trống",
                },
                {
                  validator: (_, value) => {
                    if (value && isNaN(value)) {
                      return Promise.reject(
                        new Error("Vui lòng nhập số hợp lệ")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input prefix="$" suffix="USD" autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="statusOffice"
                rules={[
                  { required: true, message: "Vui lòng không được để trống" },
                ]}
              >
                <Select placeholder="Vui lòng chọn" allowClear>
                  <Option value="ACTIV">Hoạt động</Option>
                  <Option value="UNACTIV">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <h3 className="font-semibold text-base my-2">Đồng hồ đo</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Serial Number"
              name="serialNumber"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Loại đồng hồ"
              name="meterType"
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
                <Option value="SINGLE_PHASE" label="1 Phase">
                  1 Phase
                </Option>
                <Option value="THREE_PHASE" label="3 Phase">
                  3 Phase
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base my-2">Tình trạng bàn giao</h3>

          <Button
            type="dashed"
            onClick={addHandover}
            icon={<PlusOutlined />}
            className="mt-2"
          >
            Thêm
          </Button>
        </div>

        {handoverList?.map((handover, index) => (
          <Row gutter={16} key={handover.id}>
            <Col lg={7} md={7} sm={12} xs={12}>
              <Form.Item
                label="Bản vẽ"
                name={["handoverList", index, "drawing"]}
              >
                <Upload
                  name="drawing"
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, index, "drawingFile")
                  }
                  fileList={handover.drawingFile}
                  maxCount={1}
                  accept=".pdf"
                  listType="text"
                >
                  {handover.drawingFile.length < 1 ? (
                    <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                  ) : null}
                </Upload>
              </Form.Item>
            </Col>

            <Col lg={7} md={7} sm={12} xs={12}>
              <Form.Item
                label="Thiết bị"
                name={["handoverList", index, "equipment"]}
              >
                <Upload
                  name="equipment"
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, index, "equipmentFile")
                  }
                  fileList={handover.equipmentFile}
                  maxCount={1}
                  accept=".pdf"
                  listType="text"
                >
                  {handover.equipmentFile.length < 1 ? (
                    <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                  ) : null}
                </Upload>
              </Form.Item>
            </Col>

            {data?.id ? (
              <Col lg={7} md={7} sm={21} xs={21}>
                <Form.Item
                  label="Trạng thái"
                  name="statusHandover"
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
                    <Option value="ACTIV" label="Hoạt động">
                      Hoạt động
                    </Option>
                    <Option value="INACTIV" label="Không hoạt động">
                      Không hoạt động
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              ""
            )}

            <Col xs={3} className="mt-[1.85rem]">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveHandover(handover)}
              />
            </Col>
          </Row>
        ))}

        <Button
          htmlType="submit"
          type="primary"
          disabled={isSubmit}
          className="mt-2"
        >
          {isSubmit ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalOffice;
