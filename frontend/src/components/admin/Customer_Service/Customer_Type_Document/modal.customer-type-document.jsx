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
  callCreateCustomerTypeDocument,
  callUpdateCustomerTypeDocument,
} from "../../../../services/api";

const { Option } = Select;

const ModalCustomerTypeDocument = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listCustomerTypes,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        customerType: data.customerType ? data.customerType?.id : null,
        status: data.status ? "true" : "false",
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { documentType, status, customerType } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateCustomerTypeDocument(
        data?.id,
        documentType,
        status,
        { id: customerType }
      );

      if (res && res.data) {
        message.success(res.message);
        handleReset(false);
        fetchData();
      } else {
        notification.error({
          message: "Error",
          description: res?.error,
        });
      }
    } else {
      const res = await callCreateCustomerTypeDocument(documentType, status, {
        id: customerType,
      });

      if (res && res.data) {
        message.success(res.message);
        handleReset();
        fetchData();
      } else {
        notification.error({
          message: "Error",
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
      title={data?.id ? "Cập nhật hồ sơ phân loại" : "Tạo hồ sơ phân loại"}
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
              label="Loại tài liệu"
              name="documentType"
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

export default ModalCustomerTypeDocument;
