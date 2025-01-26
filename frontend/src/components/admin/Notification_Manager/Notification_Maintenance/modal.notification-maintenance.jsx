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
  callUpdateNotificationMaintenance,
} from "../../../../services/api";
import TextArea from "antd/es/input/TextArea";

const ModalNotificationMaintenance = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    listMaintenanceTasks,
    fetchData,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        maintenanceTask: data.maintenanceTask ? data.maintenanceTask.id : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const {
      title,
      description,
      maintenanceTask,
      recipient
    } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateNotificationMaintenance(
        data?.id,
        title,
        description,
        {
          id: maintenanceTask
        },
        recipient
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
    } else {
      const res = await callCreateNotificationMaintenance(
        title,
        description,
        {
          id: maintenanceTask
        },
        recipient
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
      title={data?.id ? "Cập nhật thông báo bảo trì" : "Tạo thông báo bảo trì"}
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

          <Col xs={24}>
            <Form.Item
              label="Người nhận"
              name="recipient"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nhiệm vụ bảo trì"
              name="maintenanceTask"
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
                {listMaintenanceTasks?.map((maintenanceTask) => (
                  <Select.Option
                    key={maintenanceTask.id}
                    value={maintenanceTask.id}
                    label={maintenanceTask.taskName}
                  >
                    {maintenanceTask.taskName}
                  </Select.Option>
                ))}
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
    </Modal>
  );
};

export default ModalNotificationMaintenance;
