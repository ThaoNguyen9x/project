import React from "react";
import { PiMapPinAreaBold } from "react-icons/pi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { convertSlugUrl } from "../../services/api";

const Office = () => {
  const offices = [
    {
      id: 1,
      name: "AB Tower",
      address: "Số 76 Lê Lai, Phường Bến Thành, Quận 1",
      image:
        "https://www.galaxyoffice.vn/wp-content/uploads/2023/12/toa-nha-ab-tower-76-le-lai-quan-1.jpg",
    },
  ];

  return (
    <>
      <div className="max-w-6xl px-6 pb-5 mx-auto mt-[90px]">
        <div className="text-center text-base font-semibold uppercase mb-[20px] md:mb-[30px]">
          <p className="text-red-700">VĂN PHÒNG</p>

          <h2 className="text-blue-950 text-xl lg:text-3xl mt-1">
            THIẾT KẾ VÀ XÂY DỰNG VĂN PHÒNG
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {offices?.map((office) => (
            <Link
              key={office.id}
              to={`/van-phong/${convertSlugUrl(office.name)}-${office.id}`}
              className="border flex flex-col rounded-md hover:scale-105 duration-300 overflow-hidden"
            >
              <LazyLoadImage
                src={office.image}
                alt={office.name}
                effect="blur"
              />
              <div className="flex flex-col gap-2 p-5">
                <h3 className="font-bold uppercase">{office.name}</h3>
                <p className="text-base">
                  <PiMapPinAreaBold className="inline-block text-red-700 h-5 w-5 mr-2" />
                  {office.address}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="flex items-center justify-center mb-5 mt-10 lg:mb-10">
          <Pagination defaultCurrent={1} total={50} />
        </div> */}
      </div>
    </>
  );
};

export default Office;
