import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatBreadcrumbLabel = (value) => {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = pathnames.map((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
    const label = formatBreadcrumbLabel(value);

    return {
      title:
        index === pathnames.length - 1 ? label : <Link to={path}>{label}</Link>,
      key: path,
    };
  });

  return <Breadcrumb className="my-4" items={breadcrumbItems} />;
};

export default Breadcrumbs;
