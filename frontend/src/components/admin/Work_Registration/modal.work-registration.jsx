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
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  callCreateWorkRegistration,
  callUpdateWorkRegistration,
} from "../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalWorkRegistration = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, setCurrent } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.registrationID) {
      const init = {
        ...data,
        scheduledDate: data?.scheduledDate ? dayjs(data?.scheduledDate) : null,
      };

      if (data?.drawingUrl) {
        setDataFile([
          {
            uid: "-1",
            name: data?.drawingUrl,
            status: "done",
            url: `${
              import.meta.env.VITE_BACKEND_URL
            }/storage/work_registrations/${data?.drawingUrl}`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data, form]);

  const handleFinish = async (values) => {
    const { scheduledDate, note, status } = values;

    const image =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.registrationID) {
      const res = await callUpdateWorkRegistration(
        data?.registrationID,
        dayjs(scheduledDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        note,
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
      const res = await callCreateWorkRegistration(
        dayjs(scheduledDate).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        note,
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
    const isPdf = file.type === "application/pdf";

    if (!isPdf) {
      message.error("Bạn chỉ có thể tải lên tệp PDF");
    }

    return isPdf || Upload.LIST_IGNORE;
  };

  return (
    <Modal
      title={
        data?.registrationID
          ? "Cập nhật đăng ký thi công"
          : "Tạo đăng ký thi công"
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
              label="Bản vẽ"
              name={data?.image ? "image" : "drawingUrl"}
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
                  <Button icon={<UploadOutlined />}>Bấm để tải lên</Button>
                ) : null}
              </Upload>
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
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Ngày dự kiến"
              name="scheduledDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                className="w-full"
              />
            </Form.Item>
          </Col>

          {data?.registrationID ? (
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
                  <Option value="APPROVED" label="Đã chấp nhận">
                    Đã chấp nhận
                  </Option>
                  <Option value="REJECTED" label="Đã từ chối">
                    Đã từ chối
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

export default ModalWorkRegistration;
