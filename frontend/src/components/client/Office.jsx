import React, { useState, useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LuUser2 } from "react-icons/lu";
import { PiMapPinAreaBold } from "react-icons/pi";
import { TbZoomInArea } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";

const offices = [
  {
    id: 1,
    name: "Saigon Centre Tower",
    investor: "Keppel Land Watco I",
    address: "Số 92 – 94 Đ. Nam Kỳ Khởi Nghĩa, Bến Nghé, Quận 1, TPHCM",
    area: "46,000 m2 (500,000 sq ft)",
    price: "100",
    image:
      "https://sts-vn.com/upload/saigoncentre2-exterior_(c)nbbj_-07-05-2024-12-00-06.jpg",
  },
  {
    id: 2,
    name: "Crescent Mall",
    investor: "Tan Gek Meng",
    address: "101 Đ Tôn Dật Tiên, Tân Phú, Quận 7, Hồ Chí Minh 700000",
    area: "112,000 m2 (1,210,000 sq ft)",
    price: "100",
    image:
      "https://cscec-sea.com/wp-content/uploads/2016/12/cresent-mall01.jpg",
  },
  {
    id: 3,
    name: "Crescent Mall",
    investor: "Tan Gek Meng",
    address: "101 Đ Tôn Dật Tiên, Tân Phú, Quận 7, Hồ Chí Minh 700000",
    area: "112,000 m2 (1,210,000 sq ft)",
    price: "100",
    image:
      "https://cscec-sea.com/wp-content/uploads/2016/12/cresent-mall01.jpg",
  },
  {
    id: 4,
    name: "Saigon Centre Tower",
    investor: "Keppel Land Watco I",
    address: "Số 92 – 94 Đ. Nam Kỳ Khởi Nghĩa, Bến Nghé, Quận 1, TPHCM",
    area: "46,000 m2 (500,000 sq ft)",
    price: "100",
    image:
      "https://sts-vn.com/upload/saigoncentre2-exterior_(c)nbbj_-07-05-2024-12-00-06.jpg",
  },
];

function Office() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    cssEase: "linear",
    focusOnSelect: true,
    afterChange: (current) => setActiveIndex(current),
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative mb-[40px] md:my-[80px] mx-auto flex md:flex-row flex-col gap-10 justify-between w-full overflow-hidden">
      {/* Main Display Image */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="relative basis-1/2 w-full h-auto rounded-md overflow-hidden"
      >
        <img
          src={offices[activeIndex].image}
          alt={offices[activeIndex].name}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 z-10`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1.5, x: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="basis-1/2 overflow-hidden"
      >
        {/* Office Details */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-blue-950">
            {offices[activeIndex].name}
          </h3>
          <div className="flex items-center gap-2">
            <LuUser2 className="text-red-700 h-5 w-5" />
            <div>
              <p className="text-blue-950 text-base font-bold">Nhà đầu tư:</p>
              <p>{offices[activeIndex].investor}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PiMapPinAreaBold className="text-red-700 h-5 w-5" />
            <div>
              <p className="text-blue-950 text-base font-bold">Địa chỉ:</p>
              <p>{offices[activeIndex].address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TbZoomInArea className="text-red-700 h-5 w-5" />
            <div>
              <p className="text-blue-950 text-base font-bold">
                Tổng diện tích:
              </p>
              <p>{offices[activeIndex].area}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MdAttachMoney className="text-red-700 h-5 w-5" />
            <div>
              <p className="text-blue-950 text-base font-bold">Giá:</p>
              <p>{offices[activeIndex].price}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-300 duration-300 text-white"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-300 duration-300 text-white"
          >
            <FaAngleRight />
          </button>
        </div>

        {/* Slider Component */}
        <div className="overflow-x-hidden">
          <Slider {...settings} ref={sliderRef}>
            {offices.map((office, index) => (
              <div
                key={index}
                className={`h-[350px] lg:h-[200px] relative rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeIndex === index
                    ? "border-blue-700"
                    : "border-transparent"
                }`}
              >
                <img
                  src={office.image}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      </motion.div>
    </div>
  );
}

export default Office;
