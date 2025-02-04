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
  callCreateItemCheck,
  callUpdateItemCheck,
} from "../../../../services/api";

const { Option } = Select;

const ModalItemCheck = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listDevices } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        device: data.device ? data.device?.deviceId : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { device, checkCategory, checkName, standard, frequency } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateItemCheck(
        data?.id,
        { deviceId: device },
        checkCategory,
        checkName,
        standard,
        frequency
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
      const res = await callCreateItemCheck(
        { deviceId: device },
        checkCategory,
        checkName,
        standard,
        frequency
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
      title={data?.id ? "Cập nhật kiểm tra mục" : "Tạo kiểm tra mục"}
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
              label="Tên mục kiểm tra"
              name="checkName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Danh mục kiểm tra"
              name="checkCategory"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Tiêu chuẩn kiểm tra"
              name="standard"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Thiết bị"
              name="device"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listDevices.map((device) => (
                  <Select.Option
                    key={device.deviceId}
                    value={device.deviceId}
                    label={device.deviceName}
                  >
                    {device.deviceName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tần suất"
              name="frequency"
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
                <Option value="HÀNG_NGÀY" label="Hàng ngày">
                  Hàng ngày
                </Option>
                <Option value="HÀNG_TUẦN" label="Hàng tuần">
                  Hàng tuần
                </Option>
                <Option value="HÀNG_THÁNG" label="Hàng tháng">
                  Hàng tháng
                </Option>
                <Option value="HÀNG_QUÝ" label="Hàng quý">
                  Hàng quý
                </Option>
                <Option value="HÀNG_NĂM" label="Hàng năm">
                  Hàng năm
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

export default ModalItemCheck;
