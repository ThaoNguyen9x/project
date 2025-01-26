import React, { useContext, useState } from "react";
import {
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Tabs,
  Button,
  notification,
  message,
} from "antd";
import { AuthContext } from "../share/Context";
import { callChangePassword } from "../../services/api";

const ModalProfile = (props) => {
  const { user } = useContext(AuthContext);
  const { openProfile, setOpenProfile } = props;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const info = [
    {
      label: "Họ và tên",
      children: user?.name ?? "N/A",
      span: 3,
    },
    {
      label: "E-mail",
      children: user?.email ?? "N/A",
      span: 3,
    },
    {
      label: "Số điện thoại",
      children: user?.mobile ?? "N/A",
      span: 3,
    },
  ];

  const handleFinish = async (values) => {
    const { oldPassword, newPassword } = values;

    setIsSubmit(true);

    const res = await callChangePassword(user?.email, oldPassword, newPassword);

    if (res && res.statusCode == 200) {
      message.success(res.message);
      form.resetFields();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
      });
    }

    setIsSubmit(false);
  };

  const changePasswordForm = (
    <Form
      name="changePassword"
      onFinish={handleFinish}
      layout="vertical"
      form={form}
    >
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng không được để trống" },
            ]}
          >
            <Input.Password autoComplete="off" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng không được để trống" },
            ]}
          >
            <Input.Password autoComplete="off" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng không được để trống" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="off" allowClear />
          </Form.Item>
        </Col>
      </Row>

      <Button
        htmlType="submit"
        type="primary"
        disabled={isSubmit}
        className="mt-2"
      >
        {isSubmit ? "Đổi mật khẩu..." : "Đổi mật khẩu"}
      </Button>
    </Form>
  );

  const items = [
    {
      key: "1",
      label: "Tài khoản",
      children: <Descriptions items={info} />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: changePasswordForm,
    },
  ];

  return (
    <Modal
      open={openProfile}
      onCancel={() => {
        setOpenProfile(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  );
};

export default ModalProfile;
