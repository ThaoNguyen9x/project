import React from "react";
import { motion } from "framer-motion";

const Title = ({ subTitle, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      className="text-center text-base font-semibold uppercase mt-[40px] md:mt-[70px] mb-[10px] md:mb-[30px]"
    >
      <p className="text-red-700">{subTitle}</p>

      <h2 className="text-blue-950 text-xl lg:text-3xl mt-1">{title}</h2>
    </motion.div>
  );
};

export default Title;
