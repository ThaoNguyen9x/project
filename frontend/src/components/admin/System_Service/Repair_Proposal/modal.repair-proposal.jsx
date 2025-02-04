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
  callCreateRepairProposal,
  callUpdateRepairProposal,
} from "../../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalRepairProposal = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listRiskAssessments,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        riskAssessment: data.riskAssessment
          ? data.riskAssessment?.riskAssessmentID
          : null,
        requestDate: data.requestDate ? dayjs(data?.requestDate) : null,
      };

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const {
      title,
      description,
      requestDate,
      priority,
      proposalType,
      riskAssessment,
      status,
    } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateRepairProposal(
        data?.id,
        title,
        description,
        dayjs(requestDate).startOf("day").format("YYYY-MM-DD"),
        priority,
        proposalType,
        { riskAssessmentID: riskAssessment },
        status
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
      const res = await callCreateRepairProposal(
        title,
        description,
        dayjs(requestDate).startOf("day").format("YYYY-MM-DD"),
        priority,
        proposalType,
        { riskAssessmentID: riskAssessment },
        status
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
      title={data?.id ? "Cập nhật để xuất bảo trì" : "Tạo để xuất bảo trì"}
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
              label="Đánh giá rủi ro"
              name="riskAssessment"
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
                {listRiskAssessments.map((riskAssessment) => (
                  <Select.Option
                    key={riskAssessment.riskAssessmentID}
                    value={riskAssessment.riskAssessmentID}
                    label={`${riskAssessment.contractor.name} - ${riskAssessment.assessmentDate}`}
                  >
                    {`${riskAssessment.contractor.name} - ${riskAssessment.assessmentDate}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Tiêu đề"
              name="title"
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
              name="description"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày yêu cầu"
              name="requestDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Mức độ ưu tiên"
              name="priority"
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Loại đề xuất"
              name="proposalType"
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
                <Option value="RISK_ASSESSMENT" label="Đánh giá rủi ro">
                  Đánh giá rủi ro
                </Option>
                <Option value="ABNORMAL_FAILURE" label="Sự cố bất thường">
                  Sự cố bất thường
                </Option>
              </Select>
            </Form.Item>
          </Col>

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
                <Option value="PENDING" label="Đang chờ duyệt">
                  Đang chờ duyệt
                </Option>
                <Option value="APPROVED" label="Đã được duyệt">
                  Đã được duyệt
                </Option>
                <Option value="REJECTED" label="Bị từ chối">
                  Bị từ chối
                </Option>
                <Option value="IN_PROGRESS" label="Đang triển khai">
                  Đang triển khai
                </Option>
                <Option value="COMPLETED" label="Đã hoàn thành">
                  Đã hoàn thành
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

export default ModalRepairProposal;
