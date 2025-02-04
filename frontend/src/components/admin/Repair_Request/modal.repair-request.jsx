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
  callCreateRepairRequest,
  callUpdateRepairRequest,
} from "../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalRepairRequest = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listUsers } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.requestID) {
      const init = {
        ...data,
        account: data.account ? data.account?.id : null,
        requestDate: data.requestDate ? dayjs(data.requestDate) : null,
      };

      if (data.imageUrl) {
        setDataFile([
          {
            uid: "-1",
            name: data.imageUrl,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/repair_requests/${
              data.imageUrl
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { account, requestDate, content, status } = values;

    const image =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.requestID) {
      const res = await callUpdateRepairRequest(
        data?.requestID,
        account,
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
      const res = await callCreateRepairRequest(
        account,
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
      forceRender
      title={
        data?.requestID ? "Cập nhật yêu cầu sửa chữa" : "Tạo yêu cầu sửa chữa"
      }
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
              label="Nhân viên phụ trách"
              name="account"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listUsers
                  .filter(
                    (user) =>
                      user?.role?.name === "Technician_Employee" ||
                      (user?.role?.name === "Subcontractor" && user?.status)
                  )
                  .map((user) => (
                    <Select.Option
                      key={user.id}
                      value={user.id}
                      label={user.name}
                    >
                      {user.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Bản vẽ"
              name={data?.image ? "image" : "imageUrl"}
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
              label="Ngày yêu cầu"
              name="requestDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DDTHH:mm:ss" className="w-full" />
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
                <Option value="PENDING" label="Đang chờ xử lý">
                  Đang chờ xử lý
                </Option>
                <Option value="SUCCESS" label="Đã hoàn thành">
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

export default ModalRepairRequest;
