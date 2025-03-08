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
  callCreateSystemMaintenanceService,
  callUpdateSystemMaintenanceService,
} from "../../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalSystemMaintenanceService = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listSubcontractors,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        subcontractor: data.subcontractor ? data.subcontractor?.id : null,
        nextScheduledDate: data.nextScheduledDate
          ? dayjs(data?.nextScheduledDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateSystemMaintenanceService(
        data?.id,
        { id: values.subcontractor },
        values.serviceType,
        values.maintenanceScope,
        values.frequency,
        dayjs(values.nextScheduledDate).startOf("day").format("YYYY-MM-DD"),
        values.status
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
      const res = await callCreateSystemMaintenanceService(
        { id: values.subcontractor },
        values.serviceType,
        values.maintenanceScope,
        values.frequency,
        dayjs(values.nextScheduledDate).startOf("day").format("YYYY-MM-DD"),
        values.status
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
          ? "Cập nhật dịch vụ bảo trì hệ thống"
          : "Tạo dịch vụ bảo trì hệ thống"
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
              label="Nhà thầu phụ"
              name="subcontractor"
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
                {listSubcontractors.map((subcontractor) => (
                  <Select.Option
                    key={subcontractor.id}
                    value={subcontractor.id}
                    label={subcontractor.name}
                  >
                    {subcontractor.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Phạm vi"
              name="maintenanceScope"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Dịch vụ"
              name="serviceType"
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
                <Option value="ELECTRICAL" label="Hệ thống Điện">
                  Hệ thống Điện
                </Option>
                <Option value="PLUMBING" label="Hệ thống Cấp thoát nước">
                  Hệ thống Cấp thoát nước
                </Option>
                <Option value="HVAC" label="Hệ thống Điều hòa không khí">
                  Hệ thống Điều hòa không khí
                </Option>
                <Option value="FIRE_PROTECTION" label="Hệ thống Phòng cháy">
                  Hệ thống Phòng cháy
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày dự kiến"
              name="nextScheduledDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
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
                <Option value="MONTHLY" label="Hàng tháng">
                  Hàng tháng
                </Option>
                <Option value="QUARTERLY" label="Hàng quý">
                  Hàng quý
                </Option>
                <Option value="ANNUALLY" label="Hàng năm">
                  Hàng năm
                </Option>
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
                  <Option value="PENDING" label="Chưa giải quyết">
                    Chưa giải quyết
                  </Option>
                  <Option value="IN_PROGRESS" label="Đang tiến hành">
                    Đang tiến hành
                  </Option>
                  <Option value="COMPLETED" label="Hoàn thành">
                    Hoàn thành
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

export default ModalSystemMaintenanceService;
