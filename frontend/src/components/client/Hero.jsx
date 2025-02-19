import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div
      className="w-full min-h-[100vh] bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage:
          'linear-gradient(rgb(110, 181, 255), rgba(255, 255, 255, 0)), url("https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
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
