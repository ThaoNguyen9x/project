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

import {
  callCreateMaintenanceHistory,
  callUpdateMaintenanceHistory,
} from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalMaintenanceHistory = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listSystemMaintenanceServices,
    listUsers,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        maintenanceService: data.maintenanceService
          ? data.maintenanceService?.id
          : null,
        technician: data.technician ? data.technician?.id : null,
        performedDate: data.performedDate ? dayjs(data?.performedDate) : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const {
      maintenanceService,
      performedDate,
      notes,
      technician,
      findings,
      resolution,
      phone
    } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateMaintenanceHistory(
        data?.id,
        { id: maintenanceService },
        dayjs(performedDate).startOf("day").format("YYYY-MM-DD"),
        notes,
        { id: technician },
        findings,
        resolution,
        phone
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
      const res = await callCreateMaintenanceHistory(
        { id: maintenanceService },
        dayjs(performedDate).startOf("day").format("YYYY-MM-DD"),
        notes,
        { id: technician },
        findings,
        resolution,
        phone
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

    setIsSubmit(false);
  };

  const handleReset = async () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={data?.id ? "Cập nhật lịch sử bảo trì" : "Tạo lịch sử bảo trì"}
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/3"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={16}>
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
                    {maintenanceService.subcontractor.name} - {" "}
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

          <Col xs={24}>
            <Form.Item
              label="Kỹ thuật viên"
              name="technician"
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
                {listUsers
                  ?.filter(
                    (technician) =>
                      technician?.status &&
                      technician?.role?.name === "ENGINEERING"
                  )
                  .map((technician) => (
                    <Select.Option
                      key={technician.id}
                      value={technician.id}
                      label={technician.name}
                    >
                      {technician.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Số điện thoại khác"
              name="phone"
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Ghi chú"
              name="notes"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Vấn đề"
              name="findings"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Giải pháp"
              name="resolution"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Ngày thực hiện"
              name="performedDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
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
    </Modal>
  );
};

export default ModalMaintenanceHistory;
