import React, { useState } from "react";
import { motion } from "framer-motion";
import { message, notification } from "antd";

import { IoIosMail } from "react-icons/io";
import { MdPhoneInTalk } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    setLoading(true);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      message.success("Gửi email thành công.");
      event.target.reset();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không gửi được email. Vui lòng thử lại.",
      });
    }

    setLoading(false);
  };

  return (
    <div
      id="contact"
      className="flex flex-col md:flex-row justify-between gap-5 mx-auto my-[40px] md:my-[80px] max-w-full"
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="basis-1/2"
      >
        <p className="text-blue-950 font-semibold">
          Vui lòng cung cấp thông tin của bạn cho F-TECH để chúng tôi có thể
          liên hệ tư vấn và giải đáp thắc mắc của bạn nhanh chóng!
        </p>
        <ul>
          <li className="flex items-center my-5">
            <IoIosMail className="h-6 w-6 mr-2 text-blue-950" />
            contact@ftech.com
          </li>
          <li className="flex items-center my-5">
            <MdPhoneInTalk className="h-6 w-6 mr-2 text-blue-950" />
            +0 931-313-329
          </li>
          <li className="flex items-center my-5">
            <PiMapPinAreaFill className="h-[28px] w-[28px] mr-2 text-blue-950" />
            391a Đ. Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh
            700000
          </li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="basis-1/2"
      >
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="name">Họ và tên</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Nhập họ và tên của bạn"
              required
              className="block w-full border border-blue-950 rounded-md py-2 px-4"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại của bạn"
              required
              pattern="^[0-9]{10,15}$"
              className="block w-full border border-blue-950 rounded-md py-2 px-4"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              required
              className="block w-full border border-blue-950 rounded-md py-2 px-4"
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label htmlFor="message">Viết tin nhắn của bạn ở đây</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Nhập tin nhắn của bạn"
              required
              className="block w-full border border-blue-950 rounded-md py-2 px-4"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-950 text-white font-medium px-3 py-2 rounded-md hover:opacity-90"
          >
            {loading ? "Submitting..." : "Submit now"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
