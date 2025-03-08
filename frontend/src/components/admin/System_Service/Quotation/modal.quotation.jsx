import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Upload,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  callCreateQuotation,
  callCreateRepairProposal,
  callDeleteRepairProposal,
  callUpdateQuotation,
  callUpdateRepairProposal,
} from "../../../../services/api";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalQuotation = (props) => {
  const {
    data,
    setData,
    openModalQuotation,
    setOpenModalQuotation,
    fetchData,
    listRiskAssessments,
    setCurrent,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        repairProposal: data?.repairProposal?.id || null,
        statusQuotation: data?.status || null,

        riskAssessment:
          data?.repairProposal?.riskAssessment?.riskAssessmentID || null,
        title: data?.repairProposal?.title || null,
        description: data?.repairProposal?.description || null,
        requestDate: data?.repairProposal?.requestDate || null,
        priority: data?.repairProposal?.priority || null,
        proposalType: data?.repairProposal?.proposalType || null,
        statusRepairProposal: data?.repairProposal?.status || null,
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
  }, [data, form]);

  const handleFinish = async (values) => {
    try {
      let resRepairProposal;
      let resQuotation;

      if (!data?.id) {
        resRepairProposal = await callCreateRepairProposal(
          values.title,
          values.description,
          values.priority,
          values.proposalType,
          { riskAssessmentID: values.riskAssessment },
          values.statusRepairProposal
        );

        if (!resRepairProposal || !resRepairProposal.data) {
          throw new Error(resRepairProposal?.error);
        }

        resQuotation = await callCreateQuotation(
          values.supplierName,
          values.totalAmount,
          values.details,
          dataFile.length > 0
            ? dataFile[0].originFileObj || dataFile[0].url
            : null,
          values.statusQuotation,
          resRepairProposal.data.id
        );

        if (!resQuotation || !resQuotation.data) {
          await callDeleteRepairProposal(resRepairProposal.data.id);
          throw new Error(resQuotation?.error);
        }

        message.success("Tạo báo giá & đề xuất bảo trì thành công");
      } else {
        resRepairProposal = await callUpdateRepairProposal(
          data.repairProposal.id,
          values.title,
          values.description,
          values.priority,
          values.proposalType,
          { riskAssessmentID: values.riskAssessment },
          values.statusRepairProposal
        );

        if (!resRepairProposal || !resRepairProposal.data) {
          throw new Error(resRepairProposal?.error);
        }

        resQuotation = await callUpdateQuotation(
          data.id,
          values.supplierName,
          values.totalAmount,
          values.details,
          dataFile.length > 0
            ? dataFile[0].originFileObj || dataFile[0].url
            : null,
          values.statusQuotation,
          resRepairProposal.data.id
        );

        if (!resQuotation || !resQuotation.data) {
          throw new Error(resQuotation?.error);
        }

        message.success("Cập nhật báo giá & đề xuất bảo trì thành công");
      }

      fetchData();
      setCurrent(1);
      handleReset();
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          error?.response?.data?.message || error.message || "Đã xảy ra lỗi",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleReset = () => {
    setOpenModalQuotation(false);
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

  useEffect(() => {
    if (data?.riskAssessmentID) {
      const selectedRiskAssessment = listRiskAssessments.find(
        (riskAssessment) =>
          riskAssessment.riskAssessmentID === data.riskAssessmentID
      );

      form.setFieldsValue({
        riskAssessment: selectedRiskAssessment
          ? selectedRiskAssessment.riskAssessmentID
          : null,
      });
    }
  }, [data, listRiskAssessments]);

  return (
    <Modal
      title={
        data?.id
          ? "Cập nhật báo giá & đề xuất bảo trì"
          : "Tạo báo giá & đề xuất bảo trì"
      }
      open={openModalQuotation}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form
        name="quotation_basic"
        onFinish={handleFinish}
        layout="vertical"
        form={form}
      >
        <h3 className="font-semibold text-base my-2">Đề xuất bảo trì</h3>

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
                disabled={!!data?.riskAssessmentID}
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

        <h3 className="font-semibold text-base my-2">Báo giá</h3>

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
              <Input prefix="$" suffix="USD" autoComplete="off" allowClear />
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

export default ModalQuotation;
