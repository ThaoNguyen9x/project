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
  Image,
} from "antd";

import {
  callCreateElectricityUsage,
  callUpdateElectricityUsage,
} from "../../../../services/api";
import dayjs from "dayjs";

const ModalElectricityUsage = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listMeters } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        meter: data.meter ? data.meter?.id : null,
        readingDate: data.readingDate ? dayjs(data.readingDate) : null,
      };

      form.setFieldsValue(init);

      if (data.imageName) {
        setDataFile([
          {
            uid: "-1",
            name: data.imageName,
            status: "done",
            url: `${
              import.meta.env.VITE_BACKEND_URL
            }/storage/electricity-usages/${data.imageName}`,
          },
        ]);
      }
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { meter, startReading, endReading, readingDate, comments } = values;

    const image =
      dataFile[0]?.originFileObj || (dataFile[0] && dataFile[0]?.name);

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateElectricityUsage(
        data?.id,
        meter,
        endReading,
        dayjs(readingDate).startOf("day").format("YYYY-MM-DD"),
        image,
        comments
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
      const res = await callCreateElectricityUsage(
        meter,
        endReading,
        image,
        comments
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

    setIsSubmit(false);
  };

  const handleReset = () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
    setDataFile([]);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên tệp JPG/PNG");
    }

    return isJpgOrPng || Upload.LIST_IGNORE;
  };

  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
    });
  };

  return (
    <Modal
      title={data?.id ? "Cập nhật mức tiêu thụ điện" : "Tạo mức tiêu thụ điện"}
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item label="Image" name="image">
              <Upload
                name="image"
                listType="picture-card"
                fileList={dataFile}
                beforeUpload={beforeUpload}
                onChange={({ file, fileList }) => {
                  setDataFile(fileList);
                }}
                onRemove={() => setDataFile([])}
                onPreview={handlePreview}
                maxCount={1}
              >
                {dataFile.length < 1 && "+ Upload"}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Kết thúc đọc"
              name="endReading"
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

          {data?.id ? (
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Ngày đọc"
                name="readingDate"
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Bình luận"
              name="comments"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Input autoComplete="off" allowClear />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Meter"
              name="meter"
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
                {listMeters.map((meter) => (
                  <Select.Option
                    key={meter.id}
                    value={meter.id}
                    label={meter.serialNumber}
                  >
                    {meter.serialNumber}
                  </Select.Option>
                ))}
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

export default ModalElectricityUsage;
