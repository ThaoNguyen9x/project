import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
} from "antd";

import {
  callCreateNotificationMaintenance,
  callCreateTask,
  callUpdateNotificationMaintenance,
  callUpdateTask,
} from "../../../../services/api";
import TextArea from "antd/es/input/TextArea";

const ModalNotificationMaintenance = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, setCurrent } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        maintenanceTask: data?.maintenanceTask?.id || null,

        taskName: data?.maintenanceTask?.taskName || null,
        taskDescription: data?.maintenanceTask?.taskDescription || null,
        maintenanceType: data?.maintenanceTask?.maintenanceType || null,
        assignedTo: data?.maintenanceTask?.assignedTo || null,
        assignedToPhone: data?.maintenanceTask?.assignedToPhone || null,
        expectedDuration: data?.maintenanceTask?.expectedDuration || null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    setIsSubmit(true);

    try {
      let resTask;
      let resNotification;

      if (data?.id) {
        resTask = await callUpdateTask(
          data.id,
          values.taskName,
          values.taskDescription,
          values.maintenanceType,
          values.assignedTo,
          values.assignedToPhone,
          values.expectedDuration
        );

        if (!resTask || !resTask.data) {
          throw new Error(resTask?.error);
        }

        resNotification = await callUpdateNotificationMaintenance(
          data?.id,
          values.title,
          values.description,
          {
            id: resTask.data.id,
          }
        );

        if (!resNotification || !resNotification.data) {
          throw new Error(resNotification?.error);
        }

        message.success("Cập nhật hợp đồng khách hàng thành công");
      } else {
        resTask = await callCreateTask(
          values.taskName,
          values.taskDescription,
          values.maintenanceType,
          values.assignedTo,
          values.assignedToPhone,
          values.expectedDuration
        );

        if (!resTask || !resTask.data) {
          throw new Error(resTask?.error);
        }

        resNotification = await callCreateNotificationMaintenance(
          values.title,
          values.description,
          {
            id: resTask.data.id,
          }
        );

        if (!resNotification || !resNotification.data) {
          throw new Error(resNotification?.error);
        }

        message.success("Tạo thông báo sự cố bất thường thành công");
      }

      fetchData();
      handleReset();
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          error?.response?.data?.message || error.message || "Đã xảy ra lỗi",
      });
    }

    setCurrent(1);
    setIsSubmit(false);
  };

  const handleReset = async () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={
        data?.id
          ? "Cập nhật thông báo sự cố bất thường"
          : "Tạo thông báo sự cố bất thường"
      }
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/3"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <h3 className="font-semibold text-base my-2">Nhiệm vụ bảo trì</h3>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Tên"
              name="taskName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Mô tả"
              name="taskDescription"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Chu kỳ bảo trì"
              name="maintenanceType"
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
                <Option value="SCHEDULED" label="Bảo trì định kỳ">
                  Bảo trì định kỳ
                </Option>
                <Option value="EMERGENCY" label="Bảo trì sự cố đột xuất">
                  Bảo trì sự cố đột xuất
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Thời gian hoàn thành"
              name="expectedDuration"
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
              <Input suffix="phút" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Người thực hiện bảo trì"
              name="assignedTo"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Số điện thoại người thực hiện bảo trì"
              name="assignedToPhone"
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
        </Row>
        <h3 className="font-semibold text-base my-2">Thông báo</h3>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Tin nhắn"
              name="description"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
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

export default ModalNotificationMaintenance;
