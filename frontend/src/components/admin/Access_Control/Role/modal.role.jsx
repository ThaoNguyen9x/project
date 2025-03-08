import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import {
  callCreateRole,
  callUpdateRole,
  callGetAllPermissions,
} from "../../../../services/api";

const { Option } = Select;

const ModalRole = (props) => {
  const { data, setData, openModal, setOpenModal, fetchData, setCurrent } =
    props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [permissionsPage, setPermissionsPage] = useState(1);
  const [permissionsPageSize, setPermissionsPageSize] = useState(20);
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [paginatedPermissions, setPaginatedPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const filterQuery = searchTerm ? `name~'${searchTerm}'` : "";
      const res = await callGetAllPermissions(
        `page=${permissionsPage}&size=${permissionsPageSize}&filter=${filterQuery}`
      );
      if (res && res.data) {
        setPaginatedPermissions(res.data.result);
        setTotalPermissions(res.data.meta.total);
      }
    };

    fetchPermissions();
  }, [permissionsPage, permissionsPageSize, searchTerm]);

  useEffect(() => {
    if (data?.id) {
      const init = {
        ...data,
        permissions: data.permissions ? data.permissions.map((p) => p.id) : [],
        status: data.status ? "true" : "false",
      };

      setSelectedPermissions(init.permissions);
      form.setFieldsValue(init);
    } else {
      setSelectedPermissions([]);
    }
  }, [data, form]);

  const handleFinish = async (values) => {
    const { name, description, permissions, status } = values;

    setIsSubmit(true);

    if (data?.id) {
      const res = await callUpdateRole(
        data?.id,
        name,
        description,
        permissions?.map((id) => ({ id })),
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
      const res = await callCreateRole(
        name,
        description,
        permissions?.map((id) => ({ id })),
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

  const handleReset = async () => {
    setOpenModal(false);
    setData(null);
    form.resetFields();
    setSelectedPermissions([]);
    setPermissionsPage(1);
  };

  const handleSwitchChange = (checked, permissionId) => {
    setSelectedPermissions((prev) => {
      const newPermissions = new Set(prev);
      if (checked) {
        newPermissions.add(permissionId);
      } else {
        newPermissions.delete(permissionId);
      }
      const updatedPermissions = Array.from(newPermissions);

      form.setFieldsValue({ permissions: updatedPermissions });
      return updatedPermissions;
    });
  };

  const handleModuleSwitch = (checked, permissions) => {
    setSelectedPermissions((prev) => {
      const newPermissions = new Set(prev);

      permissions.forEach((permission) => {
        if (checked) {
          newPermissions.add(permission.id);
        } else {
          newPermissions.delete(permission.id);
        }
      });

      const updatedPermissions = Array.from(newPermissions);
      form.setFieldsValue({ permissions: updatedPermissions });

      return updatedPermissions;
    });
  };

  const groupedPermissions = paginatedPermissions?.reduce((acc, permission) => {
    if (!permission.status) return acc;

    const { module } = permission;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  const filteredGroupedPermissions = Object.entries(groupedPermissions || {})
    .filter(
      ([module, permissions]) =>
        module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permissions.some((permission) =>
          permission.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .map(([module, permissions]) => ({
      key: module,
      label: module,
      extra: (
        <Switch
          checked={permissions.every((p) => selectedPermissions.includes(p.id))}
          onChange={(checked) => handleModuleSwitch(checked, permissions)}
        />
      ),
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {permissions
            .filter((permission) => permission.status)
            .map((permission) => (
              <Card size="small" key={permission.id}>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(checked) =>
                      handleSwitchChange(checked, permission.id)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <p>{permission.name}</p>
                    <p>
                      <span
                        className={`font-bold ${
                          permission.method === "GET"
                            ? "GET"
                            : permission.method === "POST"
                            ? "POST"
                            : permission.method === "PUT"
                            ? "PUT"
                            : permission.method === "DELETE"
                            ? "DELETE"
                            : "text-purple-700"
                        }`}
                      >
                        {permission.method}
                      </span>
                      <span>: {permission.apiPath}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      ),
    }));

  return (
    <Modal
      forceRender
      title={data?.id ? "Cập nhật vai trò" : "Tạo vai trò"}
      open={openModal}
      onCancel={handleReset}
      footer={null}
      confirmLoading={isSubmit}
      className="w-full lg:!w-1/2"
    >
      <Form name="basic" onFinish={handleFinish} layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xs={24}>
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

          {data?.id ? (
            <Col xs={24}>
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
                  <Option value="true" label="Hoạt động">
                    Hoạt động
                  </Option>
                  <Option value="false" label="Không hoạt động">
                    Không hoạt động
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}

          <Col span={24}>
            <Form.Item label="Quyền hạn" name="permissions">
              <Space direction="vertical" className="w-full">
                <Input
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="mb-2"
                />
                <Collapse
                  collapsible="header"
                  items={filteredGroupedPermissions}
                />
                <Pagination
                  current={permissionsPage}
                  pageSize={permissionsPageSize}
                  total={totalPermissions}
                  onChange={setPermissionsPage}
                  pageSizeOptions={["20", "40", "60"]}
                  onShowSizeChange={(current, size) =>
                    setPermissionsPageSize(size)
                  }
                  className="mt-1"
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>

        <Button htmlType="submit" type="primary" disabled={isSubmit}>
          {isSubmit ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalRole;
