import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";

import { AuthContext } from "../share/Context";
import { WebSocketService } from "../../services/WebSocketService";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import Breadcrumbs from "./Breadcrumbs";
import MenuItem from "./MenuItem";
import Loading from "../share/Loading";
import NotFound from "../../pages/client/NotFound";

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    WebSocketService.connect(() => {}, setLoading, setError);

    return () => {
      WebSocketService.disconnect();
    };
  }, [user]);

  if (error) {
    return (
      <NotFound
        statusCode={500}
        message="Lỗi máy chủ"
        description="Đã xảy ra sự cố trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau."
      />
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout className="">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="overflow-y-auto h-[100vh] sticky start-0 top-0 bottom-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="text-xl font-bold uppercase text-white text-center py-3">
          B-MS
        </div>
        <MenuItem
          activeMenu={location.pathname}
          permissions={user?.role?.permissions}
        />
      </Sider>
      <Layout>
        <AppHeader />
        <Content className="mx-4">
          <Breadcrumbs />
          <Outlet />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
