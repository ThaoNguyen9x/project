import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-gray-400 rounded-full shadow-lg hover:bg-gray-300 duration-300 z-10 cursor-pointer"
    >
      <FaAngleRight className="text-white" />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-gray-400 rounded-full shadow-lg hover:bg-gray-300 duration-300 z-10 cursor-pointer"
    >
      <FaAngleLeft className="text-white" />
    </div>
  );
}

const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
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

  const testimonials = [
    {
      id: "1",
      name: "Cha Eun-woo",
      position: "CEO",
      image:
        "https://kenh14cdn.com/2018/5/17/photo-1-1526556327360677255416.jpg",
      body: "Tôi rất hài lòng với các dịch vụ chuyển đổi số của F-TECH. Quy trình rõ ràng và giải pháp hiệu quả của họ rất phù hợp để giúp các doanh nghiệp nhỏ và vừa phát triển bền vững.",
    },
    {
      id: "2",
      name: "Lee Min-ho",
      position: "Giám đốc Marketing",
      image:
        "https://kenh14cdn.com/2018/5/17/photo-1-1526556327360677255416.jpg",
      body: "F-TECH đã giúp chúng tôi tối ưu hóa quy trình và nâng cao sự hiện diện trực tuyến. Các giải pháp được cung cấp hiệu quả và dễ dàng tích hợp vào hoạt động hàng ngày của chúng tôi.",
    },
    {
      id: "3",
      name: "Park Seo-jun",
      position: "CTO",
      image:
        "https://kenh14cdn.com/2018/5/17/photo-1-1526556327360677255416.jpg",
      body: "Làm việc với F-TECH đã thay đổi cuộc chơi. Đội ngũ của họ hiểu rõ nhu cầu của chúng tôi và cung cấp các giải pháp vượt xa mong đợi. Hiện tại, chúng tôi đã hoạt động hiệu quả và cạnh tranh hơn.",
    },
    {
      id: "4",
      name: "Park Seo-jun",
      position: "CTO",
      image:
        "https://kenh14cdn.com/2018/5/17/photo-1-1526556327360677255416.jpg",
      body: "Làm việc với F-TECH đã thay đổi cuộc chơi. Đội ngũ của họ hiểu rõ nhu cầu của chúng tôi và cung cấp các giải pháp vượt xa mong đợi. Hiện tại, chúng tôi đã hoạt động hiệu quả và cạnh tranh hơn.",
    },
    {
      id: "5",
      name: "Park Seo-jun",
      position: "CTO",
      image:
        "https://kenh14cdn.com/2018/5/17/photo-1-1526556327360677255416.jpg",
      body: "Làm việc với F-TECH đã thay đổi cuộc chơi. Đội ngũ của họ hiểu rõ nhu cầu của chúng tôi và cung cấp các giải pháp vượt xa mong đợi. Hiện tại, chúng tôi đã hoạt động hiệu quả và cạnh tranh hơn.",
    },
  ];

  return (
    <div className="relative my-[40px] md:my-[80px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1.5, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className=""
      >
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 pt-0 pb-5 px-5">
              <div className="shadow-lg p-5 lg:p-10 rounded-md leading-normal h-auto">
                <div className="flex items-center gap-2 mb-5">
                  <LazyLoadImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    effect="blur"
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="text-blue-950 font-bold">
                      {testimonial.name}
                    </h3>
                    <span className="text-sm font-semibold">
                      {testimonial.position}
                    </span>
                  </div>
                </div>
                <p className="text-base text-gray-800">
                  {testimonial.body.length > 200
                    ? `${testimonial.body.slice(0, 200)}...`
                    : testimonial.body}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>
    </div>
  );
};

export default Testimonials;
