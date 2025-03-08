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
  DatePicker,
} from "antd";

import {
  callCreateMaintenanceHistory,
  callCreateRiskAssessment,
  callDeleteMaintenanceHistory,
  callUpdateMaintenanceHistory,
  callUpdateRiskAssessment,
} from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalMaintenanceHistory = (props) => {
  const {
    data,
    setData,
    openModalMaintenanceHistory,
    setOpenModalMaintenanceHistory,
    fetchData,
    listSystemMaintenanceServices,
    listDevices,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const riskAssessment = data?.riskAssessments?.[0] || {};
      const init = {
        ...data,
        maintenanceService: data?.maintenanceService?.id || null,
        performedDate: data?.performedDate ? dayjs(data.performedDate) : null,

        status: riskAssessment?.status || null,
        contractor: riskAssessment?.contractor?.id || null,
        riskProbability: riskAssessment?.riskProbability || null,
        riskImpact: riskAssessment?.riskImpact || null,
        systemType: riskAssessment?.systemType || null,
        riskDetection: riskAssessment?.riskDetection || null,
        riskPriorityNumber: riskAssessment?.riskPriorityNumber || null,
        mitigationAction: riskAssessment?.mitigationAction || null,
        remarks: riskAssessment?.remarks || null,

        device: riskAssessment?.device?.deviceId || null,
        assessmentDate: riskAssessment?.assessmentDate
          ? dayjs(riskAssessment.assessmentDate)
          : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    setIsSubmit(true);

    try {
      let resMaintenanceHistory;
      let resRiskAssessment;

      if (data?.id) {
        resMaintenanceHistory = await callUpdateMaintenanceHistory(
          data.id,
          { id: values.maintenanceService },
          values.performedDate
            ? dayjs(values.performedDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.notes,
          values.findings,
          values.resolution,
          values.phone
        );

        if (!resMaintenanceHistory || !resMaintenanceHistory.data) {
          throw new Error(resMaintenanceHistory?.error);
        }

        resRiskAssessment = await callUpdateRiskAssessment(
          resMaintenanceHistory?.data?.riskAssessments?.[0]?.riskAssessmentID,
          { id: resMaintenanceHistory.data.id },
          {
            id: resMaintenanceHistory.data.maintenanceService.subcontractor.id,
          },
          values.systemType,
          { deviceId: values.device },
          values.assessmentDate
            ? dayjs(values.assessmentDate).startOf("day").format("YYYY-MM-DD")
            : null,
          values.riskProbability,
          values.riskImpact,
          values.riskDetection,
          values.mitigationAction,
          values.remarks
        );

        if (!resRiskAssessment || !resRiskAssessment.data) {
          throw new Error(resRiskAssessment?.error);
        }

        message.success(
          "Cập nhật lịch sử bảo trì & đánh giá rủi ro thành công"
        );
      } else {
        resMaintenanceHistory = await callCreateMaintenanceHistory(
          { id: values.maintenanceService },
          values.notes,
          values.findings,
          values.resolution,
          values.phone
        );

        if (!resMaintenanceHistory || !resMaintenanceHistory.data) {
          throw new Error(resMaintenanceHistory?.error);
        }

        resRiskAssessment = await callCreateRiskAssessment(
          { id: resMaintenanceHistory.data.id },
          {
            id: resMaintenanceHistory.data.maintenanceService.subcontractor.id,
          },
          values.systemType,
          { deviceId: values.device },
          values.riskProbability,
          values.riskImpact,
          values.riskDetection,
          values.mitigationAction,
          values.remarks
        );

        if (!resRiskAssessment || !resRiskAssessment.data) {
          await callDeleteMaintenanceHistory(resMaintenanceHistory.data.id);
          throw new Error(resRiskAssessment?.error);
        }

        message.success("Tạo lịch sử bảo trì & đánh giá rủi ro thành công");
      }

      handleReset();
      fetchData();
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          error?.response?.data?.message || error?.message || "Đã xảy ra lỗi",
      });
    }

    setCurrent(1);
    setIsSubmit(false);
  };

  const handleReset = () => {
    setOpenModalMaintenanceHistory(false);
    setData(null);
    form.resetFields();
  };

  useEffect(() => {
    if (data?.deviceId) {
      const selectedDevice = listDevices.find(
        (device) => device.deviceId === data.deviceId
      );

      form.setFieldsValue({
        device: selectedDevice ? selectedDevice.deviceId : null,
      });
    }
  }, [data, listDevices]);

  return (
    <Modal
      forceRender
      title={
        data?.id
          ? "Cập nhật lịch sử bảo trì và đánh giá rủi ro"
          : "Tạo lịch sử bảo trì và đánh giá rủi ro"
      }
      open={openModalMaintenanceHistory}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form
        name="maintenancehistorybasic"
        onFinish={handleFinish}
        layout="vertical"
        form={form}
      >
        <h3 className="font-semibold text-base my-2">Lịch sử bảo trì</h3>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Dịch vụ bảo trì"
              name="maintenanceService"
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
                {listSystemMaintenanceServices.map((maintenanceService) => (
                  <Select.Option
                    key={maintenanceService.id}
                    value={maintenanceService.id}
                    label={`${maintenanceService.subcontractor.name} - ${
                      maintenanceService.serviceType === "ELECTRICAL"
                        ? "Hệ thống Điện"
                        : maintenanceService.serviceType === "PLUMBING"
                        ? "Hệ thống Cấp thoát nước"
                        : maintenanceService.serviceType === "HVAC"
                        ? "Hệ thống Điều hòa không khí"
                        : "Hệ thống Phòng cháy"
                    }`}
                  >
                    {maintenanceService.subcontractor.name} -{" "}
                    {maintenanceService.serviceType === "ELECTRICAL"
                      ? "Hệ thống điện"
                      : maintenanceService.serviceType === "PLUMBING"
                      ? "Hệ thống cấp thoát nước"
                      : maintenanceService.serviceType === "HVAC"
                      ? "Hệ thống điều hòa không khí"
                      : "Hệ thống phòng cháy"}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item label="Số điện thoại khác" name="phone">
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ghi chú"
              name="notes"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Vấn đề"
              name="findings"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Giải pháp"
              name="resolution"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Ngày thực hiện"
                name="performedDate"
                rules={[
                  { required: true, message: "Vui lòng không được để trống" },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <h3 className="font-semibold text-base my-2">Đánh giá rủi ro</h3>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Thiết bị"
              name="device"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                disabled={!!data?.deviceId}
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Hành động giảm thiểu"
              name="mitigationAction"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
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

          <Col lg={12} md={12} sm={24} xs={24}>
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

          {data?.id ? (
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

export default ModalMaintenanceHistory;
