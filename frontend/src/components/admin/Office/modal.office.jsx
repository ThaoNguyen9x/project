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

import { callCreateOffice, callUpdateOffice } from "../../../services/api";

const { Option } = Select;

const ModalOffice = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listLocations } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        location: data.location ? data.location?.id : null,
      };

      if (data.drawingFile) {
        setDataFile([
          {
            uid: "-1",
            name: data.drawingFile,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/offices/${
              data.drawingFile
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { name, location, area, rentPrice, serviceFee, status } = values;

    const drawing =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateOffice(
        data?.id,
        name,
        location,
        area,
        rentPrice,
        serviceFee,
        status,
        drawing
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
      const res = await callCreateOffice(
        name,
        location,
        area,
        rentPrice,
        serviceFee,
        status,
        drawing
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
      title={data?.id ? "Cập nhật văn phòng" : "Tạo văn phòng"}
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
              label="Tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Vị trí"
              name="location"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn"
                optionLabelProp="label"
                allowClear
              >
                {listLocations.map((location) => (
                  <Select.Option
                    key={location.id}
                    value={location.id}
                    label={location.floor}
                  >
                    {location.floor}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Bản vẽ"
              name={data?.drawing ? "drawing" : "drawingFile"}
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Upload
                name="drawing"
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
              label="Diện tích"
              name="area"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Giá thuê"
              name="rentPrice"
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
              label="Phí dịch vụ"
              name="serviceFee"
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
              label="Trạng thái"
              name="status"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Select placeholder="Vui lòng chọn" allowClear>
                <Option value="ACTIV">Hoạt động</Option>
                <Option value="UNACTIV">Không hoạt động</Option>
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

export default ModalOffice;
