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
  callUpdateQuotation,
} from "../../../../services/api";

const { Option } = Select;

const ModalQuotation = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listRepairProposals,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        repairProposal: data.repairProposal ? data.repairProposal?.id : null,
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
    const { supplierName, totalAmount, details, status, repairProposal } =
      values;

    const image =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateQuotation(
        data?.id,
        supplierName,
        totalAmount,
        details,
        image,
        status,
        repairProposal
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
    } else {
      const res = await callCreateQuotation(
        supplierName,
        totalAmount,
        details,
        image,
        status,
        repairProposal
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

    fetchData();
    setIsSubmit(false);
  };

  const handleReset = () => {
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
      title={data?.id ? "Cập nhật báo giá" : "Tạo báo giá"}
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Đề xuất sửa chữa"
              name="repairProposal"
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
                {listRepairProposals.map((repairProposal) => (
                  <Select.Option
                    key={repairProposal.id}
                    value={repairProposal.id}
                    label={repairProposal.title}
                  >
                    {repairProposal.title}
                  </Select.Option>
                ))}
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
