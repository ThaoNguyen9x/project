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
  callCreatePaymentContract,
  callUpdatePaymentContract,
} from "../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalPaymentContract = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listContracts,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.paymentId) {
      const init = {
        ...data,
        contract: data.contract ? data.contract?.id : null,
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { contract, paymentAmount, dueDate, paymentStatus } = values;

    setIsSubmit(true);

    if (data?.paymentId) {
      const res = await callUpdatePaymentContract(
        data?.paymentId,
        { id: contract },
        paymentAmount,
        dayjs(dueDate).startOf("day").format("YYYY-MM-DD"),
        paymentStatus
      );

      if (res && res.data) {
        message.success(res.message);
        fetchData();
        handleReset(false);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res?.error,
        });
      }
    } else {
      const res = await callCreatePaymentContract(
        { id: contract },
        paymentAmount,
        dayjs(dueDate).startOf("day").format("YYYY-MM-DD"),
        paymentStatus
      );

      if (res && res.data) {
        message.success(res.message);
        fetchData();
        handleReset();
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
      title={
        data?.paymentId
          ? "Cập nhật hợp đồng thanh toán"
          : "Tạo hợp đồng thanh toán"
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
              label="Hợp đồng"
              name="contract"
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
                {listContracts
                  .filter((contract) => contract.leaseStatus === "Active")
                  .map((contract) => (
                    <Select.Option
                      key={contract.id}
                      value={contract.id}
                      label={contract?.customer?.companyName}
                    >
                      {contract?.customer?.companyName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Số tiền thanh toán"
              name="paymentAmount"
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
              <Input prefix="$" suffix="USD" autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Hạn thanh toán"
              name="dueDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          {data?.paymentId ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="paymentStatus"
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
                  <Option value="UNPAID" label="Chưa thanh toán">
                    Chưa thanh toán
                  </Option>
                  <Option value="PAID" label="Đã thanh toán">
                    Đã thanh toán
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

export default ModalPaymentContract;
