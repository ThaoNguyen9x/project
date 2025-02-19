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

import { callCreateMeter, callUpdateMeter } from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalMeter = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listOffices } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        office: data.office ? data.office?.id : null,
        installationDate: data.installationDate
          ? dayjs(data?.installationDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { serialNumber, meterType, office } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateMeter(
        data?.id,
        serialNumber,
        meterType,
        { id: office }
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
      const res = await callCreateMeter(
        serialNumber,
        meterType,
        { id: office }
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

    setIsSubmit(false);
  };

  const handleReset = async () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={data?.id ? "Cập nhật Meter" : "Tạo Meter"}
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
              label="Serial Number"
              name="serialNumber"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Loại đồng hồ"
              name="meterType"
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
                <Option value="SINGLE_PHASE" label="1 Phase">
                  1 Phase
                </Option>
                <Option value="THREE_PHASE" label="3 Phase">
                  3 Phase
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Văn phòng"
              name="office"
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
                {listOffices.map((office) => (
                  <Select.Option
                    key={office.id}
                    value={office.id}
                    label={`${office.name} - ${office.location.floor}`}
                  >
                    {office.name} - {office.location.floor}
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

export default ModalMeter;
