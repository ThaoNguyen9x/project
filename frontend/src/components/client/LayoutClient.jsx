import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import FloatButton from "./FloatButton";
import Footer from "./Footer";

const LayoutClient = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="overflow-hidden">
      <Navbar />
      <Outlet />
      <Footer />
      <FloatButton />
    </div>
  );
};

export default LayoutClient;
