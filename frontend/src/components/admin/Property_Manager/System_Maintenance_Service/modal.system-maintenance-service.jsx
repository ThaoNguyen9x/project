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
  callCreateTask,
  callUpdateSystemMaintenanceService,
  callUpdateTask,
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
      const res1 = await callUpdateSystemMaintenanceService(
        data?.id,
        { id: values.subcontractor },
        values.serviceType,
        values.maintenanceScope,
        values.frequency,
        dayjs(values.nextScheduledDate).startOf("day").format("YYYY-MM-DD"),
        values.status
      );

      const res2 = await callUpdateTask(
        data.id,
        values.taskName,
        values.taskDescription,
        values.maintenanceType,
        values.assignedTo,
        values.assignedToPhone,
        values.expectedDuration
      );

      if (res1 && res1.data) {
        message.success(res1.message);
        handleReset(false);
        fetchData();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res1?.error,
        });
      }
    } else {
      const res1 = await callCreateSystemMaintenanceService(
        { id: values.subcontractor },
        values.serviceType,
        values.maintenanceScope,
        values.frequency,
        dayjs(values.nextScheduledDate).startOf("day").format("YYYY-MM-DD"),
        values.status
      );

      const res2 = await callCreateTask(
        values.taskName,
        values.taskDescription,
        values.maintenanceType,
        values.assignedTo,
        values.assignedToPhone,
        values.expectedDuration
      );

      if (res1 && res1.data) {
        message.success(res1.message);
        handleReset();
        fetchData();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res1?.error,
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
        data?.id
          ? "Cập nhật dịch vụ"
          : "Tạo dịch vụ"
      }
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/3"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <h3 className="font-semibold text-base my-2">
          Dịch vụ bảo trì hệ thống
        </h3>

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

        <h3 className="font-semibold text-base my-2">Nhiệm vụ bảo trì</h3>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Tên"
              name="taskName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Mô tả"
              name="taskDescription"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Chu kỳ bảo trì"
              name="maintenanceType"
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
                <Option value="SCHEDULED" label="Bảo trì định kỳ">
                  Bảo trì định kỳ
                </Option>
                <Option value="EMERGENCY" label="Bảo trì sự cố đột xuất">
                  Bảo trì sự cố đột xuất
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Thời gian hoàn thành"
              name="expectedDuration"
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
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Người thực hiện bảo trì"
              name="assignedTo"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Số điện thoại người thực hiện bảo trì"
              name="assignedToPhone"
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
