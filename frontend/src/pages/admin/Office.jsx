import React, { useState, useEffect, useContext } from "react";
import {
  callGetAllCustomerTypeDocuments,
  callGetAllCustomerTypes,
  callGetAllDevices,
  callGetAllDeviceTypes,
  callGetAllLocations,
  callGetAllRiskAssessments,
  callGetAllSystemMaintenanceServices,
  callGetAllSystems,
  callGetDevice,
  callGetLocation,
  callGetOffice,
} from "../../services/api";

import sensorImg from "../../assets/image/sensor.jpg";
import fcu from "../../assets/image/enhanced_image.png";
import pumb from "../../assets/image/pumb.png";
import electrical_cabinet from "../../assets/image/tu_dien.jpg";
import water_tank from "../../assets/image/water_tank.jpg";
import cooling_tower from "../../assets/image/water_tower.jpg";
import fire_fan from "../../assets/image/Pressurization _Fan.jpg";
import Sprinkler from "../../assets/image/sprinkler.jpg";

import { TbStairs } from "react-icons/tb";
import { GiAutoRepair } from "react-icons/gi";
import { PiElevatorLight } from "react-icons/pi";
import { GrRestroomMen, GrRestroomWomen } from "react-icons/gr";

import { FaPumpMedical } from "react-icons/fa6";
import { GiElectricalResistance } from "react-icons/gi";
import { PiSelectionPlusFill } from "react-icons/pi";
import { MdOutlineDeviceHub, MdOutlineWaterDamage } from "react-icons/md";
import { SiDwavesystems } from "react-icons/si";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import { Button, Form, Input, Select, Tooltip } from "antd";
import ViewOffice from "../../components/admin/Office/view.office";
import { AuthContext } from "../../components/share/Context";
import Access from "../../components/share/Access";
import { ALL_PERMISSIONS } from "../../components/admin/Access_Control/Permission/data/permissions";
import ModalOffice from "../../components/admin/Office/modal.office";
import ModalDevice from "../../components/admin/Property_Manager/Device/modal.device";
import ModalMaintenanceHistory from "../../components/admin/Property_Manager/Maintenance_History/modal.maintenance-history";
import ModalQuotation from "../../components/admin/System_Service/Quotation/modal.quotation";

const Office = () => {
  const [scaleFactor, setScaleFactor] = useState(10);
  const maxHeight = 44 * scaleFactor; // Chiều cao tối đa của bản vẽ electrical_cabinet

  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDevice, setOpenModalDevice] = useState(false);
  const [openModalMaintenanceHistory, setOpenModalMaintenanceHistory] =
    useState(false);
  const [openModalQuotation, setOpenModalQuotation] = useState(false);
  const [data, setData] = useState(null);
  const [listCustomerTypes, setListCustomerTypes] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [listCustomerTypeDocuments, setListCustomerTypeDocuments] = useState(
    []
  );
  const [listSystems, setListSystems] = useState([]);
  const [listDeviceTypes, setListDeviceTypes] = useState([]);
  const [listSystemMaintenanceServices, setListSystemMaintenanceServices] =
    useState([]);
  const [listDevices, setListDevices] = useState([]);
  const [listRiskAssessments, setListRiskAssessments] = useState([]);

  const [current, setCurrent] = useState(1);

  const fetchAllPages = async (apiCall, pageSize) => {
    let page = 1;
    let allResults = [];
    let hasMore = true;

    while (hasMore) {
      const query = `page=${page}&size=${pageSize}`;
      const response = await apiCall(query);
      const result = response?.data?.result || [];
      allResults = [...allResults, ...result];

      if (result.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    }
    return allResults;
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const pageSize = 20;

      const customerTypes = await fetchAllPages(
        callGetAllCustomerTypes,
        pageSize
      );
      setListCustomerTypes(customerTypes);

      const locations = await fetchAllPages(callGetAllLocations, pageSize);
      setListLocations(locations);

      const customerTypeDocuments = await fetchAllPages(
        callGetAllCustomerTypeDocuments,
        pageSize
      );
      setListCustomerTypeDocuments(customerTypeDocuments);

      const systems = await fetchAllPages(callGetAllSystems, pageSize);
      setListSystems(systems);

      const deviceTypes = await fetchAllPages(callGetAllDeviceTypes, pageSize);
      setListDeviceTypes(deviceTypes);

      const systemMaintenanceServices = await fetchAllPages(
        callGetAllSystemMaintenanceServices,
        pageSize
      );
      setListSystemMaintenanceServices(systemMaintenanceServices);

      const devices = await fetchAllPages(callGetAllDevices, pageSize);
      setListDevices(devices);

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setIsLoading(true);

    const pageSize = 20;

    const res = await callGetLocation(filter || 1);

    if (res && res.data) {
      setLocation(res.data);
    }

    const riskAssessments = await fetchAllPages(
      callGetAllRiskAssessments,
      pageSize
    );
    setListRiskAssessments(riskAssessments);

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
      return (
        <TbStairs
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("kỹ thuật")) {
      return (
        <GiAutoRepair
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("thang máy")) {
      return (
        <PiElevatorLight
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("vệ sinh nam")) {
      return (
        <GrRestroomMen
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("vệ sinh nữ")) {
      return (
        <GrRestroomWomen
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("điện tủ nguồn")) {
      return (
        <GiElectricalResistance
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("vật tư")) {
      return (
        <PiSelectionPlusFill
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("xử lý nước")) {
      return (
        <MdOutlineWaterDamage
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("bơm nước")) {
      return (
        <FaPumpMedical
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("chiler")) {
      return (
        <SiDwavesystems
          size={1.75 * scaleFactor}
          className="text-white border border-white"
        />
      );
    } else if (areaName.includes("sảnh")) {
      return "";
    } else {
      return area.name;
    }
  };

  const handleFilter = (values) => {
    let query = `${values.location}`;

    if (values.deviceType) {
      query += `?deviceType=${values.deviceType}`;
    }

    setFilter(query);
  };

  return (
    <div className="relative p-4 xl:p-6 min-h-full rounded-md bg-white">
      <div className="flex flex-col gap-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base xl:text-xl font-bold">Sơ đồ văn phòng</h2>
          <div className="flex flex-col lg:flex-row gap-2">
            <Access permission={ALL_PERMISSIONS.OFFICES.CREATE} hideChildren>
              <Tooltip placement="bottom" title="Thêm hợp đồng khách hàng">
                <Button
                  onClick={() => setOpenModal(true)}
                  className="p-2 xl:p-3 gap-1 xl:gap-2"
                >
                  <HiOutlineClipboardDocumentCheck className="h-4 w-4" />
                </Button>
              </Tooltip>
            </Access>
            <Access permission={ALL_PERMISSIONS.DEVICES.CREATE} hideChildren>
              <Tooltip placement="bottom" title="Thêm thiết bị">
                <Button
                  onClick={() => setOpenModalDevice(true)}
                  className="p-2 xl:p-3 gap-1 xl:gap-2"
                >
                  <MdOutlineDeviceHub className="h-4 w-4" />
                </Button>
              </Tooltip>
            </Access>
          </div>
        </div>
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
            deviceType: "fcu",
          }}
          className="flex items-center gap-3"
        >
          <Form.Item name="location" className="w-auto">
            <Select>
              {listLocations?.map((location) => (
                <Select.Option key={location?.id} value={location?.id}>
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
          <div className="absolute right-7 flex flex-col items-center gap-2 w-5">
            <Button
              onClick={() => setScaleFactor((prev) => Math.min(prev + 10, 20))}
            >
              +
            </Button>

            <Button
              onClick={() => setScaleFactor((prev) => Math.max(prev - 10, 10))}
            >
              -
            </Button>
          </div>

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
            {location?.offices
              ?.filter((office) => office.status === "ACTIV")
              ?.map((office, index) => (
                <div
                  onClick={async () => {
                    const res = await callGetOffice(office?.id);
                    if (res?.data) {
                      setData(res?.data);
                      setOpenViewDetail(true);
                    }
                  }}
                  className="absolute text-center border border-red-800 bg-blue-900 text-white cursor-pointer hover:bg-opacity-95"
                  key={index}
                  style={{
                    left: `${office.startX * scaleFactor}px`,
                    top: `${maxHeight - office.endY * scaleFactor}px`,
                    width: `${(office.endX - office.startX) * scaleFactor}px`,
                    height: `${(office.endY - office.startY) * scaleFactor}px`,
                  }}
                >
                  {/* Hiển thị tên Office */}
                  <div
                    style={{ fontSize: `${1.3 * scaleFactor}px` }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    {office.name}
                  </div>
                </div>
              ))}

            {/* Vẽ các Device */}
            {location?.devices
              ?.sort((a, b) => b.y - a.y)
              .map((device, index) => {
                const deviceImage =
                  deviceImages[device?.deviceType?.typeName] ||
                  deviceImages["default"];

                const imageWidth =
                  device?.deviceType?.typeName === "fcu" ? 1.75 : 1.75;
                const imageHeight =
                  device?.deviceType?.typeName === "fcu" ? 2 : 1.75;

                return (
                  <div
                    key={index}
                    onClick={async () => {
                      const res = await callGetDevice(device?.deviceId);
                      if (res?.data) {
                        setData(res?.data);
                        setOpenViewDetail(true);
                      }
                    }}
                    className="relative cursor-pointer group transition-all duration-500"
                  >
                    <img
                      src={deviceImage}
                      alt={device?.deviceName}
                      style={{
                        left: `${device?.x * scaleFactor - imageWidth / 2}px`,
                        top: `${
                          maxHeight - device?.y * scaleFactor - imageHeight / 2
                        }px`,
                        width: `${imageWidth * scaleFactor}px`,
                        height: `${imageHeight * scaleFactor}px`,
                      }}
                      className="absolute"
                    />

                    <div
                      className="hidden group-hover:block text-white text-center absolute p-2 rounded-md bg-gray-600 whitespace-nowrap z-10 w-fit"
                      style={{
                        left: `${device?.x * scaleFactor - imageWidth / 2}px`,
                        top: `${
                          maxHeight -
                          device?.y * scaleFactor +
                          imageHeight / 2 +
                          5
                        }px`,
                      }}
                    >
                      {device?.deviceName}
                    </div>
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
          setOpenModal={setOpenModal}
          setOpenModalDevice={setOpenModalDevice}
          setOpenModalMaintenanceHistory={setOpenModalMaintenanceHistory}
          setOpenModalQuotation={setOpenModalQuotation}
        />

        <ModalOffice
          data={data}
          setData={setData}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchData={fetchData}
          listCustomerTypes={listCustomerTypes}
          listLocations={listLocations}
          listCustomerTypeDocuments={listCustomerTypeDocuments}
          setCurrent={setCurrent}
        />

        <ModalDevice
          data={data}
          setData={setData}
          openModalDevice={openModalDevice}
          setOpenModalDevice={setOpenModalDevice}
          fetchData={fetchData}
          listLocations={listLocations}
          listSystems={listSystems}
          listDeviceTypes={listDeviceTypes}
          listSystemMaintenanceServices={listSystemMaintenanceServices}
          setCurrent={setCurrent}
        />

        <ModalMaintenanceHistory
          data={data}
          setData={setData}
          openModalMaintenanceHistory={openModalMaintenanceHistory}
          setOpenModalMaintenanceHistory={setOpenModalMaintenanceHistory}
          fetchData={fetchData}
          listSystemMaintenanceServices={listSystemMaintenanceServices}
          listDevices={listDevices}
          setCurrent={setCurrent}
        />

        <ModalQuotation
          data={data}
          setData={setData}
          openModalQuotation={openModalQuotation}
          setOpenModalQuotation={setOpenModalQuotation}
          fetchData={fetchData}
          listRiskAssessments={listRiskAssessments}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
};

export default Office;
