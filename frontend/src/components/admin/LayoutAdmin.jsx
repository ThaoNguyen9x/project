import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";

import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import Breadcrumbs from "./Breadcrumbs";
import { AuthContext } from "../share/Context";
import MenuItem from "./MenuItem";

const { Content, Sider } = Layout;

const App = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    setActiveMenu(location?.pathname);
  }, [location]);

  const permissions = user?.role?.permissions;

  return (
    <Layout className="min-h-[100vh] overflow-y-hidden">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="text-xl font-bold uppercase text-white text-center py-3">
          Logo
        </div>

        <MenuItem activeMenu={activeMenu} permissions={permissions} />
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
export default App;
