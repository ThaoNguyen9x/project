import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Breadcrumbs from "../../components/client/Breadcrumbs";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

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

const AboutUs = () => {
  const historiesData = [
    {
      year: "1990",
      children: [
        {
          title: "Nền móng",
          desc: "Ngành quản lý tài sản bắt đầu hình thành khi các nhà đầu tư tổ chức tìm kiếm cách tiếp cận có cấu trúc hơn để quản lý danh mục tài sản lớn.",
          quote:
            "Nền móng của quản lý tài sản được xây dựng dựa trên sự tin cậy và chuyên nghiệp.",
          milestones:
            "Vào đầu những năm 1990, ngành này chứng kiến sự thành lập của các công ty quản lý tài sản chuyên biệt đầu tiên, tập trung vào việc quản lý tài sản cá nhân và tổ chức.",
        },
      ],
    },
    {
      year: "2000",
      children: [
        {
          title: "Tích hợp công nghệ",
          desc: "Việc ra đời các công nghệ tài chính mới, bao gồm phần mềm quản lý danh mục và nền tảng giao dịch điện tử, đã cách mạng hóa quản lý tài sản.",
          quote:
            "Công nghệ đã thay đổi cách chúng ta quản lý và phát triển tài sản.",
          milestones:
            "Đầu những năm 2000 đánh dấu sự khởi đầu của các công cụ kỹ thuật số để giám sát danh mục theo thời gian thực và đánh giá rủi ro, giúp quản lý tài sản trở nên hiệu quả và minh bạch hơn.",
        },
      ],
    },
    {
      year: "2010",
      children: [
        {
          title: "Mở rộng toàn cầu",
          desc: "Ngành quản lý tài sản phát triển trên phạm vi quốc tế, khi các công ty mở văn phòng và quản lý danh mục trên khắp các quốc gia.",
          quote:
            "Trong một thế giới toàn cầu hóa, tài sản vượt qua biên giới giống như cơ hội vậy.",
          milestones:
            "Các công ty hàng đầu bắt đầu thiết lập dấu ấn toàn cầu, quản lý một loạt tài sản đa dạng tại cả các thị trường mới nổi và các nền kinh tế phát triển.",
        },
      ],
    },
    {
      year: "2015",
      children: [
        {
          title: "Sự trỗi dậy của đầu tư ESG",
          desc: "Các yếu tố Môi trường, Xã hội và Quản trị (ESG) ngày càng trở nên quan trọng trong quá trình ra quyết định đầu tư.",
          quote:
            "Đầu tư bền vững không chỉ là một xu hướng; đó là trách nhiệm.",
          milestones:
            "Các nhà quản lý tài sản ngày càng tích hợp các tiêu chí ESG vào chiến lược đầu tư của mình, đáp ứng nhu cầu về các cơ hội đầu tư có đạo đức và bền vững.",
        },
      ],
    },
    {
      year: "2020",
      children: [
        {
          title: "Thích ứng với sự biến động của thị trường",
          desc: "Để đối phó với suy thoái kinh tế toàn cầu do đại dịch COVID-19 gây ra, các nhà quản lý tài sản đã điều chỉnh chiến lược để vượt qua sự bất ổn tài chính và thích nghi với các điều kiện thị trường thay đổi.",
          quote:
            "Khả năng thích ứng trong thời kỳ bất ổn là chìa khóa để duy trì tăng trưởng dài hạn.",
          milestones:
            "Các công ty đã điều chỉnh với sự biến động thị trường thông qua các chiến lược đa dạng hóa và tập trung nhiều hơn vào quản lý rủi ro trong đại dịch, với các công cụ quản lý tài sản kỹ thuật số ngày càng được ưa chuộng.",
        },
      ],
    },
    {
      year: "Khát vọng tương lai",
      children: [
        {
          title: "Ứng dụng Trí tuệ nhân tạo",
          desc: "Tương lai của quản lý tài sản ngày càng được định hình bởi trí tuệ nhân tạo, phân tích dữ liệu và học máy, dẫn đến các chiến lược đầu tư được cá nhân hóa và dựa trên dữ liệu nhiều hơn.",
          quote:
            "AI sẽ tái định nghĩa ngành quản lý tài sản bằng cách dự đoán xu hướng thị trường và tối ưu hóa việc ra quyết định.",
          milestones:
            "Các công ty quản lý tài sản đang khám phá các giải pháp dựa trên AI cho giao dịch tự động, phân tích dự đoán và hiểu sâu hơn về khách hàng để nâng cao lợi nhuận đầu tư.",
        },
      ],
    },
  ];

  const teams = [
    {
      id: 1,
      name: "Elon Musk",
      position: "Chủ tịch Hội đồng Quản trị",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg/250px-Elon_Musk_Royal_Society_%28crop1%29.jpg",
    },
    {
      id: 2,
      name: "Emma Watson",
      position: "Giám đốc",
      image:
        "https://kenh14cdn.com/k:thumb_w/600/r9LkQbF6VoiiUUdcKz6F7w8WhmMgcd/Image/2015/01/td1/1-981c9/emma-watson-dep-long-lanh-dien-thuyet-truoc-cac-chinh-khach.jpg",
    },
    {
      id: 3,
      name: "Anne Hathaway",
      position: "Giám đốc",
      image:
        "https://media-cdn-v2.laodong.vn/Storage/newsportal/2018/4/5/599800/Annehathaway-1-2.jpg",
    },
    {
      id: 4,
      name: "Gal Gadot",
      position: "Giám đốc",
      image:
        "https://danviet.mediacdn.vn/296231569849192448/2024/3/7/2-1709775247036949730470.jpg",
    },
  ];

  const settings = {
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

  return (
    <>
      <Breadcrumbs />

      <div className="max-w-6xl px-6 pb-5 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 mx-auto my-[50px] max-w-full">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1.5, x: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-3xl font-bold text-blue-950">Khát vọng của chúng tôi</h3>
            <p>
              "Chúng tôi đã hành động, đang hành động và sẽ không bao giờ dừng
              lại trên hành trình chuyển đổi số, được thúc đẩy bởi khát vọng đưa
              công nghệ Việt phục vụ cuộc sống người Việt."
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1.5, x: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <LazyLoadImage
              src="https://img.freepik.com/premium-photo/3d-rendering-artificial-intelligence-ai-research-robot-cyborg-development-future-people-living_31965-12382.jpg"
              alt=""
              effect="blur"
              className="h-full w-full object-cover rounded-md"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1.5, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="flex flex-col items-center justify-between gap-5 mx-auto max-w-full"
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-3xl font-bold text-center text-blue-950"
          >
            Lịch Sử Hình Thành & Phát Triển
          </motion.h3>

          <ul className="relative border-l border-gray-300 my-5">
            {historiesData.map((item, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-4 h-4 bg-red-700 rounded-full -left-2"></span>
                <motion.h3
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1.5, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="flex items-center mb-1 text-4xl font-semibold text-red-700"
                >
                  {item.year}
                </motion.h3>
                {item.children &&
                  item.children.map((child, childIndex) => (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1.5, y: 0 }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      key={childIndex}
                      className="ml-6"
                    >
                      <h4 className="font-semibold text-lg text-blue-950">
                        {child.title}
                      </h4>
                      <p className="mb-4 font-normal">{child.desc}</p>
                      {child.quote && (
                        <blockquote className="italic text-gray-600">
                          “{child.quote}”
                        </blockquote>
                      )}
                      {child.milestones && (
                        <p className="mt-2">
                          <strong>Các cột mốc quan trọng:</strong>{" "}
                          {child.milestones}
                        </p>
                      )}
                    </motion.div>
                  ))}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="flex flex-col gap-16">
          <motion.h3
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-3xl font-bold text-center text-blue-950"
          >
            Đội ngũ lãnh đạo
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1.5, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <Slider {...settings}>
              {teams.map((team) => (
                <div key={team.id}>
                  <div className="flex flex-col items-center gap-2 pb-3 mb-5 px-5">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-full h-[400px] object-cover rounded-md"
                    />
                    <h3 className="text-blue-950 font-bold">{team.name}</h3>
                    <span className="text-sm font-semibold">
                      {team.position}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
