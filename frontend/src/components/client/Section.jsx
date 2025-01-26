import React from "react";
import { motion } from "framer-motion";

import { FaCheck } from "react-icons/fa6";
import { MdOutlinePlayCircleOutline } from "react-icons/md";

const Section = ({ setPlayState }) => {
  return (
    <div className="my-[50px] md:my-[100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 justify-between w-full">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        onClick={() => setPlayState(true)}
        className="relative basis-[42%] cursor-pointer"
      >
        <img
          src="https://connecteam.com/wp-content/uploads/2023/12/home-video-poster.jpg"
          alt="Video Poster"
          className="w-full object-cover rounded-md"
        />
        <MdOutlinePlayCircleOutline className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="basis-[56%] flex flex-col justify-center"
      >
        <p className="text-base font-semibold uppercase text-red-700">
          Giới thiệu về chúng tôi
        </p>
        <h3 className="text-2xl font-bold text-blue-950 my-2 leading-tight">
          Tự hào cung cấp giải pháp quản lý tòa nhà toàn diện
        </h3>
        <div className="text-base flex flex-col gap-2">
          <p>
            "Được tạo bởi Công ty Cổ phần Công nghệ F-TECH, một công ty tiên
            phong trong ngành PropTech của Việt Nam, Quản lý Bất động sản đại
            diện cho sự kết hợp hoàn hảo giữa công nghệ tiên tiến và sự tận tâm
            của chuyên gia. Phần mềm tiên tiến này mang đến một phương pháp tiếp
            cận toàn diện cho việc quản lý tòa nhà.
          </p>
          <p>
            <FaCheck className=" text-blue-950 inline-block mr-2" />
            Quản lý hoạt động hiệu quả thông qua Web và Ứng dụng quản trị
          </p>
          <p>
            <FaCheck className=" text-blue-950 inline-block mr-2" />
            Ứng dụng dành cho cư dân – Kết nối cư dân với ban quản lý tòa nhà
            một cách liền mạch."
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Section;
