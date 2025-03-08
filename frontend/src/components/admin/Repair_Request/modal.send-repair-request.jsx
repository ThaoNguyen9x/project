import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  notification,
  Row,
  Select,
} from "antd";

import { callSendRepairRequest } from "../../../services/api";

const ModalSendRepairRequest = (props) => {
  const {
    data,
    setData,
    openModalSend,
    setOpenModalSend,
    fetchData,
    listUsers,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.requestID) {
      form.setFieldsValue();
    }
  }, [data]);

  const handleFinish = async (values) => {
    setIsSubmit(true);

    const res = await callSendRepairRequest(data?.requestID, values.technician);

    if (res && res?.data) {
      message.success(res?.message);
      handleReset();
      fetchData();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
      });
    }

    setCurrent(1);
    setIsSubmit(false);
  };

  const handleReset = () => {
    setOpenModalSend(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      forceRender
      title="Gửi nhiệm vụ cho kỹ thuật viên"
      open={openModalSend}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full"
    >
      <Form
        name="basic-send"
        onFinish={handleFinish}
        layout="vertical"
        form={form}
      >
        <Row gutter={16}>
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
                    (user) =>
                      user?.status && user?.role?.name === "Technician_Employee"
                  )
                  .map((user) => (
                    <Select.Option
                      key={user?.id}
                      value={user?.id}
                      label={user?.name}
                    >
                      {user?.name}
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

export default ModalSendRepairRequest;
