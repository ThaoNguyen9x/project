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
  callCreateCustomer,
  callUpdateCustomer,
} from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalCustomer = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listCustomerTypes,
    listUsers,
    listUsersUsed,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        user: data.user ? data.user?.id : null,
        customerType: data.customerType ? data.customerType?.id : null,
        birthday: data.birthday ? dayjs(data?.birthday) : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const usedUserIds = new Set(listUsersUsed?.map((user) => user.id));

  const filteredUsers = listUsers?.filter(
    (user) =>
      user?.role?.name === "USER" &&
      (!usedUserIds.has(user.id) || data?.user?.id === user.id)
  );

  const handleFinish = async (values) => {
    const {
      companyName,
      customerType,
      email,
      phone,
      address,
      status,
      directorName,
      birthday,
      user,
    } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateCustomer(
        data?.id,
        companyName,
        { id: customerType },
        email,
        phone,
        address,
        status,
        directorName,
        dayjs(birthday).startOf("day").format("YYYY-MM-DD"),
        { id: user }
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
      const res = await callCreateCustomer(
        companyName,
        { id: customerType },
        email,
        phone,
        address,
        status,
        directorName,
        dayjs(birthday).startOf("day").format("YYYY-MM-DD"),
        { id: user }
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
      forceRender
      title={data?.id ? "Cập nhật khách hàng" : "Tạo khách hàng"}
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Liên hệ"
              name="user"
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
                {filteredUsers?.map((user) => (
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
                <Option value="ACTIV" label="Hoạt động">
                  Hoạt động
                </Option>
                <Option value="UNACTIV" label="Không hoạt động">
                  Không hoạt động
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
    </Modal>
  );
};

export default ModalCustomer;
