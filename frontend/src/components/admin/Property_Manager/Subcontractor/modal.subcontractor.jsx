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
  Rate,
  Row,
  Select,
} from "antd";

import {
  callCreateSubcontract,
  callUpdateSubcontract,
} from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalSubcontractor = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listSystems,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        system: data.system ? data.system?.id : null,
        contractStartDate: data.contractStartDate
          ? dayjs(data?.contractStartDate)
          : null,
        contractEndDate: data.contractEndDate
          ? dayjs(data?.contractEndDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { name, phone, contractStartDate, contractEndDate, rating, system } =
      values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateSubcontract(
        data?.id,
        name,
        phone,
        dayjs(contractStartDate).startOf("day").format("YYYY-MM-DD"),
        dayjs(contractEndDate).startOf("day").format("YYYY-MM-DD"),
        rating,
        { id: system }
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
      const res = await callCreateSubcontract(
        name,
        phone,
        dayjs(contractStartDate).startOf("day").format("YYYY-MM-DD"),
        dayjs(contractEndDate).startOf("day").format("YYYY-MM-DD"),
        rating,
        { id: system }
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
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={
        data?.id
          ? "Cập nhật nhà hợp đồng thầu phụ"
          : "Tạo nhà hợp đồng thầu phụ"
      }
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
              name="name"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
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
                    "Please enter a valid phone number (e.g., (123) 456-7890 or +1234567890)!",
                },
              ]}
              className="mb-2"
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
            >
              <Rate />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Hệ thống"
              name="system"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày bắt đầu"
              name="contractStartDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày kết thúc"
              name="contractEndDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const contractStartDate =
                      getFieldValue("contractStartDate");
                    if (
                      !value ||
                      !contractStartDate ||
                      value.isAfter(contractStartDate, "day")
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

export default ModalSubcontractor;
