import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
} from "antd";

import { callCreateTask, callUpdateTask } from "../../../../services/api";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalTask = (props) => {
  const { data, setData, openModal, setOpenModal, listUsers, fetchData } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        assignedTo: data.assignedTo ? data.assignedTo.id : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const {
      taskName,
      taskDescription,
      maintenanceType,
      assignedTo,
      assignedToPhone,
      expectedDuration,
    } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateTask(
        data.id,
        taskName,
        taskDescription,
        maintenanceType,
        {
          id: assignedTo,
        },
        assignedToPhone,
        expectedDuration
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
      const res = await callCreateTask(
        taskName,
        taskDescription,
        maintenanceType,
        {
          id: assignedTo,
        },
        assignedToPhone,
        expectedDuration
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
      title={data?.id ? "Cập nhật nhiệm vụ bảo trì" : "Tạo nhiệm vụ bảo trì"}
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
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nhân viên phụ trách"
              name="assignedTo"
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
                    (user) => user.status && user?.role?.name === "ENGINEERING"
                  )
                  .map((user) => (
                    <Select.Option
                      key={user.id}
                      value={user.id}
                      label={user.name}
                    >
                      {user.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item label="Số điện thoại khác" name="assignedToPhone">
              <Input autoComplete="off" allowClear />
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

export default ModalTask;
