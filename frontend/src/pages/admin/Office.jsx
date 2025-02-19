import React, { useRef, useState, useEffect, useContext } from "react";
import {
  callGetAllLocations,
  callGetLocation,
} from "../../services/api";

import sensorImg from "../../assets/image/sensor.jpg";
import fcu from "../../assets/image/enhanced_image.png";
import pumb from "../../assets/image/pumb.png";
import electrical_cabinet from "../../assets/image/tu_dien.jpg";
import water_tank from "../../assets/image/water_tank.jpg";
import cooling_tower from "../../assets/image/water_tower.jpg";
import fire_fan from "../../assets/image/Pressurization _Fan.jpg";
import Sprinkler from "../../assets/image/sprinkler.jpg"

import { TbStairs } from "react-icons/tb";
import { GiAutoRepair } from "react-icons/gi";
import { PiElevatorLight } from "react-icons/pi";
import { GrRestroomMen, GrRestroomWomen } from "react-icons/gr";

import { FaPumpMedical } from "react-icons/fa6";
import { GiElectricalResistance } from "react-icons/gi";
import { PiSelectionPlusFill } from "react-icons/pi";
import { MdOutlineWaterDamage } from "react-icons/md";
import { SiDwavesystems } from "react-icons/si";

import { Button, Form, Input, Select } from "antd";
import ViewOffice from "../../components/admin/Office/view.office";
import { AuthContext } from "../../components/share/Context";

const Office = () => {
  const scaleFactor = 10; // Tăng kích thước cho dễ nhìn
  const maxHeight = 44 * scaleFactor; // Chiều cao tối đa của bản vẽ electrical_cabinet

  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [listLocations, setListLocations] = useState([]);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");
  const [data, setData] = useState(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await callGetAllLocations();
      if (res && res.data) {
        setListLocations(res.data?.result);
      }
    };
    init();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setIsLoading(true);

    const res = await callGetLocation(filter || 1);

    if (res && res.data) {
      setLocation(res.data);
    }

    setIsLoading(false);
  };

  const deviceImages = {
    fcu: fcu, // Ảnh cho FCU
    fire_alarm: sensorImg, // Ảnh cho Sensor
    pumb: pumb, // Ảnh cho Camera (nếu có)
    electrical_cabinet: electrical_cabinet,
    water_tank: water_tank, // Ảnh mặc định nếu không có loại
    cooling_tower: cooling_tower,
    fire_fan: fire_fan,
    sprinkler: Sprinkler,
  };

  const getCommonAreas = (area) => {
    const areaName = area.name.trim().toLowerCase();

    if (areaName === "thang bộ") {
      return <TbStairs className="size-4 text-white border" />;
    } else if (areaName.includes("kỹ thuật")) {
      return <GiAutoRepair className="size-4 text-white border" />;
    } else if (areaName.includes("thang máy")) {
      return <PiElevatorLight className="size-4 text-white border" />;
    } else if (areaName.includes("vệ sinh nam")) {
      return <GrRestroomMen className="size-4 text-white border" />;
    } else if (areaName.includes("vệ sinh nữ")) {
      return <GrRestroomWomen className="size-4 text-white border" />;
    } else if (areaName.includes("điện tủ nguồn")) {
      return <GiElectricalResistance className="size-4 text-white border" />;
    } else if (areaName.includes("vật tư")) {
      return <PiSelectionPlusFill className="size-4 text-white border" />;
    } else if (areaName.includes("xử lý nước")) {
      return <MdOutlineWaterDamage className="size-4 text-white border" />;
    } else if (areaName.includes("bơm nước")) {
      return <FaPumpMedical className="size-4 text-white border" />;
    } else if (areaName.includes("chiler")) {
      return <SiDwavesystems className="size-4 text-white border" />;
    } else if (areaName.includes("sảnh")) {
      return "";
    } else {
      return area.name;
    }
  };

  const handleFilter = (values) => {
    // Use '1' as the default location if no location is selected
    let query = `${values.location}`;

    if (values.deviceType) {
      query += `?deviceType=${values.deviceType}`;
    }

    setFilter(query);
  };

  return (
    <div className="p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="flex flex-col gap-5">
        <h2 className="text-base xl:text-xl font-bold">Sơ đồ văn phòng</h2>
        <div className="flex flex-col lg:flex-row gap-5 w-full lg:max-w-fit border rounded-md p-5">
          <div className="flex items-center gap-2">
            <div className="border border-yellow-400 rounded-md bg-yellow-400 p-2"></div>
            Khung Location
          </div>
          <div className="flex items-center gap-2">
            <div className="border rounded-md bg-white p-2"></div>
            Khu vực không sử dụng
          </div>
          <div className="flex items-center gap-2">
            <div className="border border-gray-200 rounded-md bg-gray-200 p-2"></div>
            Khu vực chung
          </div>
          <div className="flex items-center gap-2">
            <div className="border border-blue-900 rounded-md bg-blue-900 p-2"></div>
            Văn phòng
          </div>
        </div>

        <Form
          form={form}
          onFinish={handleFilter}
          initialValues={{
            location: 1,
          }}
          className="flex items-center gap-3"
        >
          <Form.Item name="location" className="w-auto">
            <Select>
              {listLocations?.map((location) => (
                <Select.Option key={location.id} value={location.id}>
                  {location.floor}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="deviceType">
            <Input allowClear placeholder="Tìm kiếm loại thiết bị..." />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit">Tìm kiếm</Button>
          </Form.Item>
        </Form>

        <div className="flex items-center justify-center w-full">
          <div
            className="relative"
            style={{
              width: `${location?.endX * scaleFactor}px`,
              height: `${maxHeight}px`,
            }}
          >
            {/* Vẽ khung Location với viền màu vàng */}
            <div
              className="absolute bg-gray-200 border border-yellow-400"
              style={{
                left: `${location?.startX * scaleFactor}px`,
                top: `${maxHeight - location?.endY * scaleFactor}px`,
                width: `${(location?.endX - location?.startX) * scaleFactor}px`,
                height: `${
                  (location?.endY - location?.startY) * scaleFactor
                }px`,
              }}
            />

            {/* Hiển thị tọa độ góc dưới phải */}
            <div
              className="absolute text-sm whitespace-nowrap z-10"
              style={{
                left: `${location?.startX * scaleFactor + 5}px`,
                top: `${maxHeight - location?.startY * scaleFactor + 15}px`,
              }}
            >
              ({location?.startX}, {location?.startY})
            </div>

            {/* Hiển thị tọa độ góc trên trái */}
            <div
              className="absolute text-sm whitespace-nowrap z-10"
              style={{
                left: `${location?.endX * scaleFactor - 30}px`,
                top: `${maxHeight - location?.endY * scaleFactor - 5}px`,
              }}
            >
              ({location?.endX}, {location?.endY})
            </div>

            {/* Vẽ phần không thể sử dụng với màu trắng */}
            <div
              className="absolute bg-white border border-b-yellow-400 border-l-yellow-400 border-r-transparent border-t-transparent"
              style={{
                left: `${30 * scaleFactor}px`,
                top: `${maxHeight - 41 * scaleFactor}px`,
                width: `${(44 - 30) * scaleFactor}px`,
                height: `${(41 - 19) * scaleFactor}px`,
              }}
            />

            {/* Vẽ các CommonArea */}
            {location?.commonAreas?.map((area, index) => (
              <div
                className={`absolute group ${
                  area.color ? "bg-gray-800" : "bg-gray-400"
                } hover:bg-black transition-colors duration-500 cursor-pointer`}
                key={index}
                style={{
                  left: `${area.startX * scaleFactor}px`,
                  top: `${maxHeight - area.endY * scaleFactor}px`,
                  width: `${(area.endX - area.startX) * scaleFactor}px`,
                  height: `${(area.endY - area.startY) * scaleFactor}px`,
                }}
              >
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {getCommonAreas(area)}
                </div>

                <div className="hidden group-hover:block text-white text-center absolute -top-4 p-2 rounded-md bg-gray-600 whitespace-nowrap z-10 w-fit">
                  {area.name}
                </div>
              </div>
            ))}

            {/* Vẽ các Office */}
            {location?.offices?.map((office, index) => (
              <div
                onClick={() => {
                  setData(office);
                  setOpenViewDetail(true);
                }}
                className="absolute border-blue-900 bg-blue-900 text-white cursor-pointer"
                key={index}
                style={{
                  left: `${office.startX * scaleFactor}px`,
                  top: `${maxHeight - office.endY * scaleFactor}px`,
                  width: `${(office.endX - office.startX) * scaleFactor}px`,
                  height: `${(office.endY - office.startY) * scaleFactor}px`,
                }}
              >
                {/* Hiển thị tên Office */}
                <div className="absolute left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {office.name}
                </div>
              </div>
            ))}

            {/* Vẽ các Device */}
            {location?.devices
              ?.sort((a, b) => b.y - a.y)
              .map((device, index) => {
                const deviceImage =
                  deviceImages[device?.deviceType?.typeName] || deviceImages["default"];
                const imageWidth =
                  device?.deviceType?.typeName === "fcu" ? 80 : 20;
                const imageHeight =
                  device?.deviceType?.typeName === "fcu" ? 60 : 20;

                return (
                  <div key={index}>
                    <img
                      src={deviceImage}
                      alt={device.deviceName}
                      style={{
                        position: "absolute",
                        left: `${device.x * scaleFactor - imageWidth / 2}px`,
                        top: `${
                          maxHeight - device.y * scaleFactor - imageHeight / 2
                        }px`,
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <ViewOffice
          user={user}
          data={data}
          setData={setData}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />
      </div>
    </div>
  );
};

export default Office;
