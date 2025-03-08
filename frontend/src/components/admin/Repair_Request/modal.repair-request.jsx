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
  callCreateRepairRequest,
  callUpdateRepairRequest,
} from "../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const ModalRepairRequest = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, setCurrent } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.requestID) {
      const init = {
        ...data,
        requestDate: data?.requestDate ? dayjs(data?.requestDate) : null,
      };

      if (data?.imageUrl) {
        setDataFile([
          {
            uid: "-1",
            name: data?.imageUrl,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/repair_requests/${
              data?.imageUrl
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { requestDate, content, status } = values;

    const image =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (!data?.requestID) {
      const res = await callCreateRepairRequest(
        dayjs(requestDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        content,
        image,
        status
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
      const res = await callUpdateRepairRequest(
        data?.requestID,
        dayjs(requestDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        content,
        image,
        status
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

  const handleReset = () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
    setDataFile([]);
  };

  const beforeUpload = (file) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const isAllowed = allowedTypes.includes(file.type);

    if (!isAllowed) {
      message.error("Bạn chỉ có thể tải lên tệp PDF, JPG, JPEG, PNG, WEBP");
    }

    return isAllowed || Upload.LIST_IGNORE;
  };

  return (
    <Modal
      forceRender
      title={
        data?.requestID ? "Cập nhật yêu cầu sửa chữa" : "Tạo yêu cầu sửa chữa"
      }
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Hình ảnh đính kèm"
              name={data?.image ? "image" : "imageUrl"}
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Upload
                disabled={!!data?.requestID}
                name="image"
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => setDataFile(fileList)}
                fileList={dataFile}
                maxCount={1}
                listType="text"
              >
                {dataFile.length < 1 ? (
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                ) : null}
              </Upload>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <TextArea
                disabled={!!data?.requestID}
                autoSize={{ minRows: 3, maxRows: 5 }}
                allowClear
              />
            </Form.Item>
          </Col>

          {data?.requestID && (
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
                  <Option value="PENDING" label="Đang chờ xử lý">
                    Đang chờ xử lý
                  </Option>
                  <Option value="FAILED" label="Đã thất bại">
                    Đã thất bại
                  </Option>
                  <Option value="SUCCESS" label="Đã hoàn thành">
                    Đã hoàn thành
                  </Option>
                </Select>
              </Form.Item>
            </Col>
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

export default ModalRepairRequest;
