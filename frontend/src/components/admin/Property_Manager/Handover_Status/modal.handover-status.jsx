import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Upload,
  Form,
  message,
  Modal,
  notification,
  Row,
  Select,
  DatePicker,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  callCreateHandoverStatus,
  callUpdateHandoverStatus,
} from "../../../../services/api";
import dayjs from "dayjs";

const { Option } = Select;

const ModalHandoverStatus = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, listOffices } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        office: data.office ? data.office.id : null,
        handoverDate: data.handoverDate ? dayjs(data.handoverDate) : null,
      };

      if (data.drawingFile) {
        setDataFile([
          {
            uid: "-1",
            name: data.drawingFile,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/handover_status/${
              data.drawingFile
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { handoverDate, status, office, equipmentFile } = values;

    const drawing =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateHandoverStatus(
        data?.id,
        dayjs(handoverDate).startOf("day").format("YYYY-MM-DD"),
        status,
        office,
        equipmentFile,
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
      const res = await callCreateHandoverStatus(
        dayjs(handoverDate).startOf("day").format("YYYY-MM-DD"),
        status,
        office,
        equipmentFile,
        drawing
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

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    if (!isPdf) message.error("Bạn chỉ có thể tải lên các tập tin PDF");
    return isPdf || Upload.LIST_IGNORE;
  };

  return (
    <Modal
      title={
        data?.id ? "Cập nhật tình trạng bàn giao" : "Tạo tình trạng bàn giao"
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
              label="Thiết bị"
              name="equipmentFile"
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
              name={data?.drawing ? "drawing" : "drawingFile"}
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <Upload
                name="drawing"
                beforeUpload={beforeUpload}
                onChange={({ fileList }) => {
                  setDataFile(fileList);
                }}
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

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày bàn giao"
              name="handoverDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Văn phòng"
              name="office"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
              className="mb-2"
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
                {listOffices
                  .filter((office) => office.status === "ACTIV")
                  .map((office) => (
                    <Select.Option
                      key={office.id}
                      value={office.id}
                      label={`${office.name} - ${office.location.floor}`}
                    >
                      {office.name} - {office.location.floor}
                    </Select.Option>
                  ))}
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
              className="mb-2"
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
                <Option value="ACTIV" label="Hoạt động">
                  Hoạt động
                </Option>
                <Option value="INACTIV" label="Không hoạt động">
                  Không hoạt động
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

export default ModalHandoverStatus;
