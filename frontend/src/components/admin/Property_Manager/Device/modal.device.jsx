import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
} from "antd";

import { callCreateDevice, callUpdateDevice } from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalDevice = (props) => {
  const {
    data,
    setData,
    openModalDevice,
    setOpenModalDevice,
    fetchData,
    listSystems,
    listLocations,
    listDeviceTypes,
    listSystemMaintenanceServices,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.deviceId) {
      const init = {
        ...data,
        system: data.system ? data.system?.id : null,
        location: data.location ? data.location?.id : null,
        deviceType: data.deviceType ? data.deviceType?.id : null,
        maintenanceService: data.maintenanceService
          ? data.maintenanceService?.id
          : null,
        installationDate: data.installationDate
          ? dayjs(data?.installationDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data, form]);

  const handleFinish = async (values) => {
    const {
      system,
      location,
      deviceType,
      deviceName,
      installationDate,
      lifespan,
      status,
      maintenanceService,
      x,
      y,
    } = values;

    setIsSubmit(true);

    if (data?.deviceId) {
      const res = await callUpdateDevice(
        data?.deviceId,
        { id: system },
        { id: location },
        { id: deviceType },
        deviceName,
        dayjs(installationDate).startOf("day").format("YYYY-MM-DD"),
        lifespan,
        status,
        { id: maintenanceService },
        x,
        y
      );

      if (res && res.data) {
        message.success(res.message);
        handleReset(false);
        fetchData();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res?.error,
        });
      }
    } else {
      const res = await callCreateDevice(
        { id: system },
        { id: location },
        { id: deviceType },
        deviceName,
        dayjs(installationDate).startOf("day").format("YYYY-MM-DD"),
        lifespan,
        status,
        { id: maintenanceService },
        x,
        y
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
    }

    setCurrent(1);
    setIsSubmit(false);
  };

  const handleReset = async () => {
    setOpenModalDevice(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={data?.deviceId ? "Cập nhật thiết bị" : "Tạo thiết bị"}
      open={openModalDevice}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/3"
    >
      <Form
        name="device-basic"
        onFinish={handleFinish}
        layout="vertical"
        form={form}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Tên thiết bị"
              name="deviceName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Hệ thống"
              name="system"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listSystems.map((system) => (
                  <Select.Option
                    key={system.id}
                    value={system.id}
                    label={system.systemName}
                  >
                    {system.systemName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Dịch vụ bảo trì"
              name="maintenanceService"
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
                {listSystemMaintenanceServices.map((maintenanceService) => (
                  <Select.Option
                    key={maintenanceService.id}
                    value={maintenanceService.id}
                    label={`${maintenanceService.subcontractor.name} - ${
                      maintenanceService.serviceType === "ELECTRICAL"
                        ? "Hệ thống Điện"
                        : maintenanceService.serviceType === "PLUMBING"
                        ? "Hệ thống Cấp thoát nước"
                        : maintenanceService.serviceType === "HVAC"
                        ? "Hệ thống Điều hòa không khí"
                        : "Hệ thống Phòng cháy"
                    }`}
                  >
                    {maintenanceService.subcontractor.name} -{" "}
                    {maintenanceService.serviceType === "ELECTRICAL"
                      ? "Hệ thống điện"
                      : maintenanceService.serviceType === "PLUMBING"
                      ? "Hệ thống cấp thoát nước"
                      : maintenanceService.serviceType === "HVAC"
                      ? "Hệ thống điều hòa không khí"
                      : "Hệ thống phòng cháy"}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tuổi thọ"
              name="lifespan"
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
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ X"
              name="x"
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
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tọa độ Y"
              name="y"
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
              <Input allowClear />
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
              label="Loại thiết bị"
              name="deviceType"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listDeviceTypes.map((deviceType) => (
                  <Select.Option
                    key={deviceType.id}
                    value={deviceType.id}
                    label={deviceType.typeName}
                  >
                    {deviceType.typeName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {data?.deviceId ? (
            <>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Ngày cài đặt"
                  name="installationDate"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                  ]}
                >
                  <DatePicker format="YYYY-MM-DD" className="w-full" />
                </Form.Item>
              </Col>

              <Col lg={12} md={12} sm={24} xs={24}>
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
                    <Option value="ACTIVE" label="Hoạt động">
                      Hoạt động
                    </Option>
                    <Option value="UNDER_MAINTENANCE" label="Đang bảo trì">
                      Đang bảo trì
                    </Option>
                    <Option value="FAULTY" label="Lỗi">
                      Lỗi
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </>
          ) : (
            ""
          )}
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
    </Modal>
  );
};

export default ModalDevice;
