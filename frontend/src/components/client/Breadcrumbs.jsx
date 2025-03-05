import React from "react";
import { useLocation, Link } from "react-router-dom";

const vietnameseMapping = {
  home: "Trang chủ",
  "lien-he": "Liên Hệ",
  "gioi-thieu": "Giới Thiệu",
  "van-phong": "Văn Phòng",
};

const Breadcrumbs = ({ title, page }) => {
  const location = useLocation();

  const routes = [
    { path: "/", breadcrumb: "Trang chủ" },
    { path: `/${page}`, breadcrumb: page },
    { path: `/${page}/:pid/${title}`, breadcrumb: title },
  ];

  const translateBreadcrumb = (breadcrumb) => {
    return (
      vietnameseMapping[breadcrumb] ||
      breadcrumb.replace(/-/g, " ").toUpperCase()
    );
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [
      { path: "/", breadcrumb: translateBreadcrumb("home") },
    ];

    pathnames.forEach((_, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      const breadcrumb = pathnames[index];
      breadcrumbs.push({
        path,
        breadcrumb: translateBreadcrumb(breadcrumb),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="mt-[4rem] bg-blue-950 text-white flex flex-col items-center gap-2 p-10 uppercase">
      <div className="text-4xl font-bold">
        {translateBreadcrumb(currentBreadcrumb.breadcrumb)}
      </div>
      <div className="flex">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            <Link to={crumb.path} className="text-white hover:text-red-700">
              {translateBreadcrumb(crumb.breadcrumb)}
            </Link>
            {index < breadcrumbs.length - 1 && <span className="mx-2">-</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
