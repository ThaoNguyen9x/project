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
  callCreateResultCheck,
  callUpdateResultCheck,
} from "../../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalResultCheck = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listItemChecks,
    listUsers,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        itemCheck: data.itemCheck ? data.itemCheck?.id : null,
        technician: data.technician ? data.technician?.id : null,
        checkedAt: data.checkedAt ? dayjs(data?.checkedAt) : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { itemCheck, result, note, technician, checkedAt } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateResultCheck(
        data?.id,
        { id: itemCheck },
        result,
        note,
        { id: technician },
        dayjs(checkedAt).startOf("day").format("YYYY-MM-DDTHH:mm:ss")
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
      const res = await callCreateResultCheck(
        { id: itemCheck },
        result,
        note,
        { id: technician },
        dayjs(checkedAt).startOf("day").format("YYYY-MM-DDTHH:mm:ss")
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
      title={
        data?.id ? "Cập nhật kết quả kiểm tra mục" : "Tạo kết quả kiểm tra mục"
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
              label="Tên mục kiểm tra"
              name="itemCheck"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listItemChecks.map((itemCheck) => (
                  <Select.Option
                    key={itemCheck.id}
                    value={itemCheck.id}
                    label={itemCheck.checkName}
                  >
                    {itemCheck.checkName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Ghi chú"
              name="note"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Nhân viên phụ trách"
              name="technician"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listUsers
                  ?.filter(
                    (technician) =>
                      technician?.role?.name === "Technician_Employee" &&
                      technician?.status
                  )
                  .map((technician) => (
                    <Select.Option
                      key={technician.id}
                      value={technician.id}
                      label={technician.name}
                    >
                      {technician.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Kết quả"
              name="result"
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
                <Option value="ĐẠT" label="Đạt">
                  Đạt
                </Option>
                <Option value="KHÔNG_ĐẠT" label="Không đạt">
                  Không đạt
                </Option>
                <Option value="CẦN_SỬA_CHỮA" label="Cần sửa chữa">
                  Cần sửa chữa
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Thời gian kiểm tra"
              name="checkedAt"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DDTHH:mm:ss" className="w-full" />
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

export default ModalResultCheck;
