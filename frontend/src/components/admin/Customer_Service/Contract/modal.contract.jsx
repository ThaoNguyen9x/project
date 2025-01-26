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
import dayjs from "dayjs";

import {
  callCreateContract,
  callUpdateContract,
} from "../../../../services/api";

const { Option } = Select;

const ModalContract = (props) => {
  const {
    data,
    setData,
    openModal,
    setOpenModal,
    fetchData,
    listCustomers,
    listOffices,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [dataFile, setDataFile] = useState([]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        customer: data.customer ? data.customer?.id : null,
        office: data.office ? data.office?.id : null,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      };

      if (data.fileName) {
        setDataFile([
          {
            uid: "-1",
            name: data.fileName,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/storage/contracts/${
              data.fileName
            }`,
          },
        ]);
      }

      form.setFieldsValue(init);
    }
  }, [data]);

  const handleFinish = async (values) => {
    const { startDate, endDate, leaseStatus, office, customer } = values;

    const drawing =
      dataFile.length > 0
        ? dataFile[0].response?.url || dataFile[0].originFileObj
        : null;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateContract(
        data?.id,
        dayjs(startDate).startOf("day").format("YYYY-MM-DD"),
        dayjs(endDate).startOf("day").format("YYYY-MM-DD"),
        leaseStatus,
        office,
        customer,
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
      const res = await callCreateContract(
        dayjs(startDate).startOf("day").format("YYYY-MM-DD"),
        dayjs(endDate).startOf("day").format("YYYY-MM-DD"),
        leaseStatus,
        office,
        customer,
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
      message.error("Bạn chỉ có thể tải lên các tập tin PDF");
    }

    return isPdf || Upload.LIST_IGNORE;
  };

  return (
    <Modal
      forceRender
      title={data?.id ? "Cập nhật hợp đồng" : "Tạo hợp đồng"}
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
              name={data?.drawing ? "drawing" : "fileName"}  
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
              label="Ngày bắt đầu"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Ngày kết thúc"
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng không được để trống" },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Khách hàng"
              name="customer"
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
                {listCustomers
                  .filter((customer) => customer.status === "ACTIV")
                  .map((customer) => (
                    <Select.Option
                      key={customer.id}
                      value={customer.id}
                      label={customer.companyName}
                    >
                      {customer.companyName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              label="Văn phòng"
              name="office"
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
              name="leaseStatus"
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
                <Option value="Active" label="Hoạt động">
                  Hoạt động
                </Option>
                <Option value="Pending" label="Đang chờ gia hạn">
                  Đang chờ gia hạn
                </Option>
                <Option value="Inactive" label="Đã chấm dứt">
                  Đã chấm dứt
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

export default ModalContract;
