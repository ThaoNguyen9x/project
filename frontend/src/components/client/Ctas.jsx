import React from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import iconMan from "../../assets/icons/icon-management.svg";
import iconEng from "../../assets/icons/icon-engineering.svg";
import iconFi from "../../assets/icons/icon-financial.svg";
import iconRe from "../../assets/icons/icon-resident.svg";

const Ctas = () => {
  const items = [
    {
      id: 1,
      icon: iconMan,
      bg: "bg-blue-700",
      title: "QUẢN LÝ DỮ LIỆU",
      description:
        "Quản lý toàn diện các công ty, dự án, tòa nhà, cư dân và tài sản với hiệu quả tối ưu.",
    },
    {
      id: 2,
      icon: iconEng,
      bg: "bg-blue-800",
      title: "KỸ THUẬT VẬN HÀNH",
      description:
        "Nâng cao hiệu quả vận hành tòa nhà, tối ưu quản lý nhân sự, nhiệm vụ, bảo trì, và nhiều hơn nữa.",
    },
    {
      id: 3,
      icon: iconFi,
      bg: "bg-blue-900",
      title: "KẾ TOÁN TÀI CHÍNH",
      description:
        "Tính toán công nợ nhanh chóng, thông báo phí và quản lý tài chính minh bạch.",
    },
    {
      id: 4,
      icon: iconRe,
      bg: "bg-blue-950",
      title: "TƯƠNG TÁC CƯ DÂN",
      description:
        "Cư dân có thể dễ dàng tương tác với ban quản lý và thanh toán nhanh chóng qua ứng dụng.",
    },
  ];

  return (
    <div className="my-[40px] md:my-[80px] mx-auto w-[100%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-between text-white">
      {items?.map((item) => (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1.5, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          key={item.id}
          className={`${item.bg} p-5 rounded-md group cursor-pointer`}
        >
          <div className="relative flex flex-col items-center text-center ">
            <LazyLoadImage
              src={item.icon}
              alt="Data Management Icon"
              effect="blur"
              className="w-16 h-16 object-cover"
            />
            <h3 className="font-bold uppercase mt-5 text-nowrap">
              {item.title}
            </h3>

            <div
              className={`absolute opacity-0 pt-[1%] group-hover:opacity-100 group-hover:pt-0 transition-all duration-300 top-0 left-0 bottom-0 right-0 ${item.bg}`}
            >
              {item.description}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Ctas;
