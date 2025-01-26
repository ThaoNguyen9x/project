import React, { useState } from "react";
import Slider from "react-slick";

import {
  FaAngleLeft,
  FaAngleRight,
  FaCar,
  FaMotorcycle,
  FaRegSnowflake,
} from "react-icons/fa6";
import {
  GiClockwork,
  GiFireExtinguisher,
  GiPowerGenerator,
} from "react-icons/gi";
import { BsBuilding } from "react-icons/bs";
import { PiElevator } from "react-icons/pi";
import { TbSettingsDollar, TbZoomInArea } from "react-icons/tb";
import { BiCctv } from "react-icons/bi";
import { MdAttachMoney } from "react-icons/md";
import { ImPower } from "react-icons/im";
import { useParams } from "react-router-dom";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 -right-3 transform -translate-y-1/2 p-2 bg-gray-400 rounded-full shadow-lg hover:bg-gray-300 duration-300 z-10 cursor-pointer"
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
      className="absolute top-1/2 -left-3 transform -translate-y-1/2 p-2 bg-gray-400 rounded-full shadow-lg hover:bg-gray-300 duration-300 z-10 cursor-pointer"
    >
      <FaAngleLeft className="text-white" />
    </div>
  );
}

const Detail = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const images = [
    "https://www.galaxyoffice.vn/wp-content/uploads/2023/12/toa-nha-ab-tower-76-le-lai-quan-1.jpg",
    "https://www.galaxyoffice.vn/wp-content/uploads/2023/12/toa-nha-ab-tower-76-le-lai-quan-1.jpg",
    "https://www.galaxyoffice.vn/wp-content/uploads/2023/12/toa-nha-ab-tower-76-le-lai-quan-1.jpg",
  ];

  const mainSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const thumbSettings = {
    slidesToShow: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => setActiveIndex(current),
  };

  const generateMapLink = (address) => {
    const baseUrl = "https://maps.google.com/maps";
    const query = `?q=${encodeURIComponent(address)}&output=embed`;
    return baseUrl + query;
  };

  const info = [
    {
      title: "Năm hoàn thành:",
      icon: GiClockwork,
      value: "2010",
    },
    {
      title: "Diện tích sàn:",
      icon: TbZoomInArea,
      value: "803 m² mỗi tầng",
    },
    {
      title: "Kết cấu tòa nhà:",
      icon: BsBuilding,
      value: "26 tầng và 3 tầng hầm",
    },
    {
      title: "An ninh tòa nhà:",
      icon: BiCctv,
      value: "24/7 CCTV giám sát",
    },
    {
      title: "Hệ thống điều hòa không khí:",
      icon: FaRegSnowflake,
      value: "Hệ thống điều hòa không khí tập trung",
    },
    {
      title: "Hệ thống phòng cháy chữa cháy:",
      icon: GiFireExtinguisher,
      value: "Cảm biến và vòi phun nước tự động",
    },
    {
      title: "Máy phát điện:",
      icon: GiPowerGenerator,
      value: "Máy phát điện dự phòng đảm bảo 100% công suất điện",
    },
    {
      title: "Thang máy:",
      icon: PiElevator,
      value: "5 thang khách, 1 thang đỗ xe, 1 thang chở hàng",
    },
  ];

  const rentals = [
    {
      title: "Khu vực chia cắt:",
      icon: TbZoomInArea,
      value: "105, 265, 525, 1057, 2114, 4228 m²",
    },
    {
      title: "Giá thuê:",
      icon: MdAttachMoney,
      value: "$47 / m²",
    },
    {
      title: "Phí quản lý:",
      icon: TbSettingsDollar,
      value: "$6.5 / m² / tháng",
    },
    {
      title: "Phí gửi xe máy:",
      icon: FaMotorcycle,
      value: "300,000 VND / xe / tháng",
    },
    {
      title: "Phí đậu xe ô tô:",
      icon: FaCar,
      value: "4,950,000 VND / xe / tháng",
    },
    {
      title: "Phí điện sử dụng:",
      icon: ImPower,
      value: "Theo tỷ giá của chính phủ",
    },
  ];

  const { id } = useParams();
  const officeId = id.split("-").pop();

  return (
    <div className="max-w-6xl px-6 pb-5 mx-auto mt-[90px]">
      <div className="text-base font-semibold mb-[30px]">
        <h2 className="text-blue-950 text-xl mt-1">AB Tower</h2>
        <p className="text-red-700">Số 76 Lê Lai, Phường Bến Thành, Quận 1</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-10">
        {/* Image Slider */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-auto rounded-md overflow-hidden">
            <Slider asNavFor={nav2} ref={setNav1} {...mainSettings}>
              {images.map((src, idx) => (
                <img key={idx} src={src} alt={`Image ${idx + 1}`} />
              ))}
            </Slider>
          </div>
          {/* Thumbnail Slider */}
          <Slider
            asNavFor={nav1}
            ref={setNav2}
            {...thumbSettings}
            className="gap-slider"
          >
            {images.map((src, idx) => (
              <div
                key={idx}
                className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeIndex === idx ? "border-blue-700" : "border-transparent"
                }`}
              >
                <img src={src} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Overview Section */}
        <div>
          <h3 className="text-xl font-bold uppercase text-blue-950 mb-5">
            Thông tin tổng quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:my-5">
            {info.map((item, index) => (
              <div key={index} className="border rounded-md py-2 px-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  {item.title}
                </p>
                <div className="flex gap-2 font-semibold">
                  <div>
                    <item.icon className="h-6 w-6 text-red-700" />
                  </div>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 my-5">
        {/* Main Content Section */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-xl font-bold uppercase text-blue-950">
            Thông tin giá thuê
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
            {rentals.map((rental, index) => (
              <div key={index} className="border rounded-md py-2 px-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  {rental.title}
                </p>
                <div className="flex items-center gap-2 font-semibold">
                  <rental.icon className="h-6 w-6 text-red-700" />
                  <span>{rental.value}</span>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-bold uppercase text-blue-950 mb-3">
            Thông tin chi tiết
          </h3>
          <div className="flex flex-col gap-2.5">
            <p>
              Nằm ở khu vực trung tâm thành phố đắc địa, tòa nhà{" "}
              <strong>Saigon Centre</strong> không chỉ là biểu tượng kiến trúc
              mang tính biểu tượng mà còn là điểm đến lý tưởng cho các doanh
              nghiệp tìm kiếm một không gian làm việc chuyên nghiệp, thể hiện
              đẳng cấp thương hiệu. Tọa lạc tại{" "}
              <strong>65 đường Lê Lợi, phường Bến Nghé</strong>, ngay trung tâm
              Quận 1, khu vực sầm uất này được bao quanh bởi nhiều tiện ích hạ
              tầng thuận lợi.
            </p>
            <p>
              <strong>Saigon Centre</strong> là một tòa văn phòng cao cấp với
              tổng diện tích <strong>1.057 m²</strong>, bao gồm 10 tầng văn
              phòng từ tầng 5 đến tầng 14.
            </p>
            <p>
              Được xây dựng với mục tiêu đảm bảo sự tiện lợi và hiệu quả hoạt
              động cho các doanh nghiệp, tòa nhà <strong>Saigon Centre</strong>{" "}
              được trang bị thang máy hiện đại, bao gồm{" "}
              <strong>năm thang máy chở khách</strong>,{" "}
              <strong>một thang máy dành cho bãi đỗ xe</strong>, và{" "}
              <strong>một thang máy chở hàng với tải trọng 1.600 kg</strong>,
              đảm bảo sự di chuyển nhanh chóng và thuận tiện cho tất cả cư dân
              trong tòa nhà.
            </p>
            <p>
              Ngoài ra, toàn bộ tòa nhà được trang bị{" "}
              <strong>hệ thống điều hòa trung tâm</strong>, mang lại không gian
              làm việc mát mẻ và thoáng đãng. Đặc biệt,{" "}
              <strong>Saigon Centre Tower</strong> còn được lắp đặt{" "}
              <strong>máy phát điện</strong> chuyên dụng, có khả năng đáp ứng
              toàn bộ nhu cầu năng lượng của tòa nhà, loại bỏ mọi lo ngại về
              nguồn cung cấp điện.
            </p>
            <p>
              Tòa nhà hiện đang cho thuê với mức giá hợp lý bắt đầu từ{" "}
              <strong>$47 mỗi m²</strong>. Các chi phí liên quan bao gồm phí
              quản lý là <strong>$6,5 mỗi m² mỗi tháng</strong>, phí gửi xe máy
              là <strong>300.000 VND mỗi xe mỗi tháng</strong>, và phí gửi ô tô
              là <strong>4.950.000 VND mỗi xe mỗi tháng</strong>. Mức giá thuê
              đã bao gồm chi phí điện, đảm bảo rằng các khách thuê không cần lo
              lắng về việc tính toán thêm chi phí sử dụng điện.
            </p>
            <p>
              Trên hết, <strong>Saigon Centre Tower</strong> mang đến một môi
              trường làm việc lý tưởng với các tiện ích hiện đại và dịch vụ
              chuyên nghiệp, hỗ trợ sự phát triển và thành công của công ty bạn.
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và đảm
              bảo vị trí chiến lược nhất trong tòa nhà.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <h3 className="text-xl font-bold uppercase text-blue-950">
            Vị trí trên bản đồ
          </h3>

          <div className="my-5">
            <iframe
              src={generateMapLink(
                "FPT Aptech, 590 Cách Mạng Tháng Tám, Quận 3, Hồ Chí Minh, Việt Nam"
              )}
              title={`Map of Saigon center`}
              className="h-[400px] w-full rounded-md border"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
