import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div
      className="w-full min-h-[100vh] bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage:
          'linear-gradient(rgb(110, 181, 255), rgba(255, 255, 255, 0)), url("https://www.rentgrace.com/images/banner-1.jpg")',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="text-center max-w-[900px] text-white"
      >
        <h1 className="text-2xl md:text-6xl font-semibold uppercase">
          Dịch vụ quản lý tài sản
        </h1>
        <p
          className="max-w-[800px] text-lg md:text-2xl font-semibold leading-normal"
          style={{ margin: "10px auto 20px" }}
        >
          Cải thiện cuộc sống của các nhà đầu tư và cư dân bất động sản từ năm
          1978
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;
