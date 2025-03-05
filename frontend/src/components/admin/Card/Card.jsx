import CardItem from "./CardItem";
import { LuUsers } from "react-icons/lu";
import { TbUserHeart } from "react-icons/tb";
import { PiBuildingOffice } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {
  callGetAllCustomers,
  callGetAllOffices,
  callGetAllSubcontracts,
  callGetAllUsers,
} from "../../../services/api";

const Card = () => {
  const [listUsers, setListUsers] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listOffices, setListOffices] = useState([]);
  const [listSubContracts, setListSubContracts] = useState([]);

  useEffect(() => {
    const init = async () => {
      const users = await callGetAllUsers();
      if (users && users?.data) {
        setListUsers(users?.data?.meta);
      }

      const customers = await callGetAllCustomers();
      if (customers && customers?.data) {
        setListCustomers(customers?.data?.meta);
      }

      const offices = await callGetAllOffices();
      if (offices && offices?.data) {
        setListOffices(offices?.data?.meta);
      }

      const subContracts = await callGetAllSubcontracts();
      if (subContracts && subContracts?.data) {
        setListSubContracts(subContracts?.data?.meta);
      }
    };
    init();
  }, []);

  const cardItems = [
    {
      icon: (
        <LuUsers className="rounded-full bg-red-700 p-2 text-5xl text-white" />
      ),
      title: "Tài khoản",
      value: listUsers?.total || 0,
    },
    {
      icon: (
        <TbUserHeart className="rounded-full bg-red-700 p-2 text-5xl text-white" />
      ),
      title: "Khách hàng",
      value: listCustomers?.total || 0,
    },
    {
      icon: (
        <PiBuildingOffice className="rounded-full bg-red-700 p-2 text-5xl text-white" />
      ),
      title: "Văn phòng",
      value: listOffices?.total || 0,
    },
    {
      icon: (
        <FaUserTie className="rounded-full bg-red-700 p-2 text-5xl text-white" />
      ),
      title: "Nhà thầu phụ",
      value: listSubContracts?.total || 0,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {cardItems.map((item, index) => (
        <CardItem item={item} key={index} />
      ))}
    </div>
  );
};

export default Card;
