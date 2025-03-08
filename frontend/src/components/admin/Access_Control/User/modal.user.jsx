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
import { callCreateUser, callUpdateUser } from "../../../../services/api";

const { Option } = Select;

const ModalUser = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    listRoles,
    fetchData,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        status: data?.status ? "true" : "false",
        role: data?.role ? data?.role?.id : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { name, email, mobile, password, status, role } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateUser(data?.id, name, email, mobile, status, {
        id: role,
      });

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
      const res = await callCreateUser(name, email, mobile, password, status, {
        id: role,
      });

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
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      forceRender
      title={data?.id ? "Cập nhật tài khoản" : "Tạo tài khoản"}
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Họ và tên"
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
              label="E-mail"
              name="email"
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
                  <Input.Password autoComplete="off" />
                </Form.Item>
              </Col>
            </>
          )}

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Vai trò"
              name="role"
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
                {listRoles
                  ?.filter((role) => role?.status)
                  .map((role) => (
                    <Select.Option
                      key={role?.id}
                      value={role?.id}
                      label={role?.name}
                    >
                      {role?.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          {data?.id ? (
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

export default ModalUser;
