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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  callCreateQuotation,
  callCreateRepairProposal,
  callUpdateQuotation,
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
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        riskAssessment: data.riskAssessment
          ? data.riskAssessment?.riskAssessmentID
          : null,
        requestDate: data.requestDate ? dayjs(data?.requestDate) : null,
      };

      if (data.fileName) {
        setDataFile([
          {
            uid: "-1",
            name: data.fileName,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/quotations/${
              data.fileName
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    setIsSubmit(true);

    if (data?.id) {
      const resRepairProposal = await callUpdateRepairProposal(
        data?.id,
        values.title,
        values.description,
        values.priority,
        values.proposalType,
        { riskAssessmentID: values.riskAssessment },
        values.statusRepairProposal
      );

      const resQuotation = await callUpdateQuotation(
        data?.id,
        values.supplierName,
        values.totalAmount,
        values.details,
        values.image,
        values.statusQuotation,
        resRepairProposal.data.id
      );

      if (
        resRepairProposal &&
        resRepairProposal.data &&
        resQuotation &&
        resQuotation.data
      ) {
        message.success("Thành công");
        handleReset(false);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: resRepairProposal?.error || resQuotation?.error,
        });
      }
    } else {
      const resRepairProposal = await callCreateRepairProposal(
        values.title,
        values.description,
        values.priority,
        values.proposalType,
        { riskAssessmentID: values.riskAssessment },
        values.statusRepairProposal
      );

      const resQuotation = await callCreateQuotation(
        values.supplierName,
        values.totalAmount,
        values.details,
        values.image,
        values.statusQuotation,
        resRepairProposal.data.id
      );

      if (
        resRepairProposal &&
        resRepairProposal.data &&
        resQuotation &&
        resQuotation.data
      ) {
        message.success("Thành công");
        handleReset(false);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: resRepairProposal?.error || resQuotation?.error,
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
    setDataFile([]);
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";

    if (!isPdf) {
      message.error("Bạn chỉ có thể upload file pdf!");
    }

    return isPdf || Upload.LIST_IGNORE;
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
        <h3>Đề xuất bảo trì</h3>
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
                    label={`${riskAssessment.contractor.name}`}
                  >
                    {`${riskAssessment.contractor.name}`}
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

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Trạng thái"
                name="statusRepairProposal"
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
          ) : (
            ""
          )}
        </Row>

        <h3>Báo giá</h3>
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="File"
              name={data?.image ? "image" : "fileName"}
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Upload
                name="image"
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => setDataFile(fileList)}
                fileList={dataFile}
                maxCount={1}
                accept=".pdf"
                listType="text"
              >
                {dataFile.length < 1 ? (
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                ) : null}
              </Upload>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Nhà cung cấp"
              name="supplierName"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Tổng tiền báo giá"
              name="totalAmount"
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
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Chi tiết"
              name="details"
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
                label="Trạng thái"
                name="statusQuotation"
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

export default ModalRepairProposal;
