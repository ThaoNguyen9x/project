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
  callCreateRiskAssessment,
  callUpdateRiskAssessment,
} from "../../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalRiskAssessment = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listMaintenanceHistories,
    listSubcontractors,
    listDevices,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.riskAssessmentID) {
      const init = {
        ...data,
        maintenanceHistory: data.maintenanceHistory
          ? data.maintenanceHistory?.id
          : null,
        contractor: data.contractor ? data.contractor?.id : null,
        device: data.device ? data.device?.deviceId : null,
        assessmentDate: data.assessmentDate
          ? dayjs(data?.assessmentDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const {
      maintenanceHistory,
      contractor,
      systemType,
      device,
      assessmentDate,
      riskProbability,
      riskImpact,
      riskDetection,
      mitigationAction,
      remarks,
    } = values;

    setIsSubmit(true);

    if (data?.riskAssessmentID) {
      const res = await callUpdateRiskAssessment(
        data?.riskAssessmentID,
        { id: maintenanceHistory },
        { id: contractor },
        systemType,
        { deviceId: device },
        dayjs(assessmentDate).startOf("day").format("YYYY-MM-DD"),
        riskProbability,
        riskImpact,
        riskDetection,
        mitigationAction,
        remarks
      );

      if (res && res.data) {
        message.success(res.message);
        handleReset(false);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res?.error,
        });
      }
    } else {
      const res = await callCreateRiskAssessment(
        { id: maintenanceHistory },
        { id: contractor },
        systemType,
        { deviceId: device },
        dayjs(assessmentDate).startOf("day").format("YYYY-MM-DD"),
        riskProbability,
        riskImpact,
        riskDetection,
        mitigationAction,
        remarks
      );

      if (res && res.data) {
        message.success(res.message);
        handleReset();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res?.error,
        });
      }
    }

    fetchData();
    setIsSubmit(false);
  };

  const handleReset = async () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
  };

  return (
    <Modal
      title={data?.riskAssessmentID ? "Cập nhật đánh giá rủi ro" : "Tạo đánh giá rủi ro"}
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
              label="Lịch sử bảo trì"
              name="maintenanceHistory"
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
                {listMaintenanceHistories.map((maintenanceHistory) => (
                  <Select.Option
                    key={maintenanceHistory.id}
                    value={maintenanceHistory.id}
                    label={`${maintenanceHistory.maintenanceService.subcontractor.name} - ${maintenanceHistory.technician.name} - ${maintenanceHistory.performedDate}`}
                  >
                    {maintenanceHistory.maintenanceService.subcontractor.name} -{" "}
                    {maintenanceHistory.technician.name} -{" "}
                    {maintenanceHistory.performedDate}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nhà thầu phụ"
              name="contractor"
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
                {listSubcontractors.map((contractor) => (
                  <Select.Option
                    key={contractor.id}
                    value={contractor.id}
                    label={contractor.name}
                  >
                    {contractor.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
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
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
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

          <Col xs={24}>
            <Form.Item
              label="Hành động giảm thiểu"
              name="mitigationAction"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nhận xét"
              name="remarks"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Loại hệ thống"
              name="systemType"
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
                <Option value="ELECTRICAL">Hệ thống Điện</Option>
                <Option value="PLUMBING">Hệ thống Cấp thoát nước</Option>
                <Option value="HVAC">Hệ thống Điều hòa không khí</Option>
                <Option value="FIRE_PROTECTION">Hệ thống Phòng cháy</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Xác xuất rủi ro"
              name="riskProbability"
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
                {Array.from({ length: 10 }, (_, i) => (
                  <Option
                    key={i + 1}
                    value={(i + 1).toString()}
                    label={(i + 1).toString()}
                  >
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tác động rủi ro"
              name="riskImpact"
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
                {Array.from({ length: 10 }, (_, i) => (
                  <Option
                    key={i + 1}
                    value={(i + 1).toString()}
                    label={(i + 1).toString()}
                  >
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Phát hiện rủi ro"
              name="riskDetection"
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
                {Array.from({ length: 10 }, (_, i) => (
                  <Option
                    key={i + 1}
                    value={(i + 1).toString()}
                    label={(i + 1).toString()}
                  >
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày đánh giá"
              name="assessmentDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
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

export default ModalRiskAssessment;
