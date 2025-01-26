import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  DollarOutlined,
  FormOutlined,
  MergeOutlined,
  NotificationOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  ShopOutlined,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ALL_PERMISSIONS } from "./Access_Control/Permission/data/permissions";

const checkPermission = (permissions, apiPath, method, aclEnabled) => {
  return (
    aclEnabled === "false" ||
    permissions?.some(
      (item) => item.apiPath === apiPath && item.method === method
    )
  );
};

const generateMenuSection = (
  label,
  key,
  icon,
  permissions,
  aclEnabled,
  items
) => {
  const filteredItems = items.filter((item) =>
    checkPermission(permissions, item?.apiPath, item?.method, aclEnabled)
  );
  return filteredItems.length > 0
    ? {
        label,
        key,
        icon,
        children: filteredItems.map((item) => ({
          label: <Link to={item.path}>{item.label}</Link>,
          key: item.path,
        })),
      }
    : null;
};

const MenuItem = ({ activeMenu, permissions }) => {
  const [menuItems, setMenuItems] = useState([]);

  const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;

  useEffect(() => {
    if (permissions?.length || ACL_ENABLE === "false") {
      const fullMenu = [
        {
          label: <Link to="/dashboard">Bảng Điều Khiển</Link>,
          key: "/dashboard",
          icon: <AppstoreOutlined />,
        },

        generateMenuSection(
          "Quản Lý Truy Cập",
          "sub1",
          <UserOutlined />,
          permissions,
          ACL_ENABLE,
          [
            {
              label: "Tài khoản",
              path: "/dashboard/users",
              apiPath: ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.USERS.GET_PAGINATE.method,
            },
            {
              label: "Vai trò",
              path: "/dashboard/roles",
              apiPath: ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.ROLES.GET_PAGINATE.method,
            },
            {
              label: "Quyền hạn",
              path: "/dashboard/permissions",
              apiPath: ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.method,
            },
          ]
        ),

        generateMenuSection(
          "Dịch Vụ Khách Hàng",
          "sub2",
          <ProfileOutlined />,
          permissions,
          ACL_ENABLE,
          [
            {
              label: "Hợp đồng",
              path: "/dashboard/contracts",
              apiPath: ALL_PERMISSIONS.CONTRACTS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.CONTRACTS.GET_PAGINATE.method,
            },
            {
              label: "Khách hàng",
              path: "/dashboard/customers",
              apiPath: ALL_PERMISSIONS.CUSTOMERS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.CUSTOMERS.GET_PAGINATE.method,
            },
            {
              label: "Hồ sơ phân loại",
              path: "/dashboard/customer-type-documents",
              apiPath:
                ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.GET_PAGINATE.apiPath,
              method:
                ALL_PERMISSIONS.CUSTOMER_TYPE_DOCUMENTS.GET_PAGINATE.method,
            },
            {
              label: "Loại khách hàng",
              path: "/dashboard/customer-types",
              apiPath: ALL_PERMISSIONS.CUSTOMER_TYPES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.CUSTOMER_TYPES.GET_PAGINATE.method,
            },
          ]
        ),

        checkPermission(
          permissions,
          ALL_PERMISSIONS.OFFICES.GET_PAGINATE.apiPath,
          ALL_PERMISSIONS.OFFICES.GET_PAGINATE.method,
          ACL_ENABLE
        )
          ? {
              label: <Link to="/dashboard/offices">Văn phòng</Link>,
              key: "/dashboard/offices",
              apiPath: ALL_PERMISSIONS.OFFICES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.OFFICES.GET_PAGINATE.method,
              icon: <ShopOutlined />,
            }
          : null,

        checkPermission(
          permissions,
          ALL_PERMISSIONS.PAYMENT_CONTRACTS.GET_PAGINATE.apiPath,
          ALL_PERMISSIONS.PAYMENT_CONTRACTS.GET_PAGINATE.method,
          ACL_ENABLE
        )
          ? {
              label: <Link to="/dashboard/payment-contracts">Thanh toán</Link>,
              key: "/dashboard/payment-contracts",
              apiPath: ALL_PERMISSIONS.PAYMENT_CONTRACTS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.PAYMENT_CONTRACTS.GET_PAGINATE.method,
              icon: <DollarOutlined />,
            }
          : null,

        checkPermission(
          permissions,
          ALL_PERMISSIONS.REPAIR_REQUEST.GET_PAGINATE.apiPath,
          ALL_PERMISSIONS.REPAIR_REQUEST.GET_PAGINATE.method,
          ACL_ENABLE
        )
          ? {
              label: (
                <Link to="/dashboard/repair-requests">Yêu cầu sửa chữa</Link>
              ),
              key: "/dashboard/repair-requests",
              apiPath: ALL_PERMISSIONS.REPAIR_REQUEST.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.REPAIR_REQUEST.GET_PAGINATE.method,
              icon: <ToolOutlined />,
            }
          : null,

        checkPermission(
          permissions,
          ALL_PERMISSIONS.WORK_REGISTRATIONS.GET_PAGINATE.apiPath,
          ALL_PERMISSIONS.WORK_REGISTRATIONS.GET_PAGINATE.method,
          ACL_ENABLE
        )
          ? {
              label: (
                <Link to="/dashboard/work-registrations">
                  Đăng ký công việc
                </Link>
              ),
              key: "/dashboard/work-registrations",
              apiPath: ALL_PERMISSIONS.WORK_REGISTRATIONS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.WORK_REGISTRATIONS.GET_PAGINATE.method,
              icon: <FormOutlined />,
            }
          : null,

        generateMenuSection(
          "Quản Lý Tài Sản",
          "sub3",
          <ReconciliationOutlined />,
          permissions,
          ACL_ENABLE,
          [
            {
              label: "Thiết bị",
              apiPath: ALL_PERMISSIONS.DEVICES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.DEVICES.GET_PAGINATE.method,
              path: "/dashboard/devices",
            },
            {
              label: "Loại thiết bị",
              apiPath: ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.DEVICE_TYPES.GET_PAGINATE.method,
              path: "/dashboard/device-types",
            },
            {
              label: "Tình trạng bàn giao",
              apiPath: ALL_PERMISSIONS.HANDOVER_STATUS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.HANDOVER_STATUS.GET_PAGINATE.method,
              path: "/dashboard/handover-status",
            },
            {
              label: "Lịch sử bảo trì",
              apiPath:
                ALL_PERMISSIONS.MAINTENANCE_HISTORIES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.MAINTENANCE_HISTORIES.GET_PAGINATE.method,
              path: "/dashboard/maintenance-histories",
            },
            {
              label: "Hợp đồng nhà thầu phụ",
              apiPath: ALL_PERMISSIONS.SUBCONTRACTS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.SUBCONTRACTS.GET_PAGINATE.method,
              path: "/dashboard/subcontracts",
            },
            {
              label: "Dịch vụ bảo trì hệ thống",
              apiPath:
                ALL_PERMISSIONS.SYSTEM_MAINTENANCE_SERVICES.GET_PAGINATE
                  .apiPath,
              method:
                ALL_PERMISSIONS.SYSTEM_MAINTENANCE_SERVICES.GET_PAGINATE.method,
              path: "/dashboard/maintenance-services",
            },
            {
              label: "Hệ thống",
              apiPath: ALL_PERMISSIONS.SYSTEMS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.SYSTEMS.GET_PAGINATE.method,
              path: "/dashboard/systems",
            },
          ]
        ),

        generateMenuSection(
          "Dịch Vụ Hệ Thống",
          "sub4",
          <MergeOutlined />,
          permissions,
          ACL_ENABLE,
          [
            {
              label: "Mức tiêu thụ điện",
              apiPath: ALL_PERMISSIONS.ELECTRICITY_USAGES.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.ELECTRICITY_USAGES.GET_PAGINATE.method,
              path: "/dashboard/electricity-usages",
            },
            {
              label: "Đồng hồ đo",
              apiPath: ALL_PERMISSIONS.METERS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.METERS.GET_PAGINATE.method,
              path: "/dashboard/meters",
            },
            {
              label: "Báo giá",
              apiPath: ALL_PERMISSIONS.QUOTATIONS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.QUOTATIONS.GET_PAGINATE.method,
              path: "/dashboard/quotations",
            },
            {
              label: "Đề xuất bảo trì",
              apiPath: ALL_PERMISSIONS.REPAIR_PROPOSALS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.REPAIR_PROPOSALS.GET_PAGINATE.method,
              path: "/dashboard/repair-proposals",
            },
            {
              label: "Đánh giá rủi ro",
              apiPath: ALL_PERMISSIONS.RISK_ASSESSMENTS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.RISK_ASSESSMENTS.GET_PAGINATE.method,
              path: "/dashboard/risk-assessments",
            },
          ]
        ),

        generateMenuSection(
          "Quản lý thông báo",
          "sub5",
          <NotificationOutlined />,
          permissions,
          ACL_ENABLE,
          [
            {
              label: "Thông báo bảo trì",
              apiPath:
                ALL_PERMISSIONS.NOTIFICATION_MAINTENANCES.GET_PAGINATE.apiPath,
              method:
                ALL_PERMISSIONS.NOTIFICATION_MAINTENANCES.GET_PAGINATE.method,
              path: "/dashboard/notifications",
            },
            {
              label: "Nhiệm vụ bảo trì",
              apiPath: ALL_PERMISSIONS.TASKS.GET_PAGINATE.apiPath,
              method: ALL_PERMISSIONS.TASKS.GET_PAGINATE.method,
              path: "/dashboard/tasks",
            },
          ]
        ),
      ];

      const validMenuItems = fullMenu.filter((item) => item !== null);
      setMenuItems(validMenuItems);
    }
  }, [permissions]);

  const memoizedMenuItems = useMemo(() => {
    const cleanMenuItems = menuItems?.map(
      ({ apiPath, method, ...item }) => item
    );
    return cleanMenuItems;
  }, [menuItems]);

  return (
    <Menu
      theme="dark"
      selectedKeys={[activeMenu]}
      mode="inline"
      items={memoizedMenuItems}
    />
  );
};

export default MenuItem;
