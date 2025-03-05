import React, { useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

import Card from "../../components/admin/Card/Card";
import CustomBarChart from "../../components/admin/Chart/CustomBarChart";
import CustomPieChart from "../../components/admin/Chart/CustomPieChart";
import Tables from "../../components/admin/Tables";
import Activity from "../../components/admin/Activity";
import { AuthContext } from "../../components/share/Context";
import {
  callGetAllElectricityUsages,
  callGetAllPaymentContracts,
  callGetAllUsers,
} from "../../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [userStatus, setUserStatus] = useState({});

  const [listPayments, setListPayments] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [listElectricityUsages, setListElectricityUsages] = useState([]);

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

      const payments = await fetchAllPages(
        callGetAllPaymentContracts,
        pageSize
      );
      payments.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setListPayments(payments);

      const users = await fetchAllPages(callGetAllUsers, pageSize);
      users.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setListUsers(users);

      const electricityUsages = await fetchAllPages(
        callGetAllElectricityUsages,
        pageSize
      );
      electricityUsages.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setListElectricityUsages(electricityUsages);

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const client = Stomp.over(sock);

    client.debug = () => {};

    client.connect({}, () => {
      setStompClient(client);

      const topics = [`/topic/user-status`];

      topics.forEach((topic) => {
        client.subscribe(topic, (messageOutput) => {
          const data = JSON.parse(messageOutput.body);

          if (topic === `/topic/user-status`) {
            setUserStatus((prev) => ({ ...prev, ...data }));
          }
        });
      });

      client.send(
        "/app/user-status",
        {},
        JSON.stringify({ userId: user.id, status: "online" })
      );

      const handleTabClose = () => {
        if (client.connected) {
          client.send(
            "/app/user-status",
            {},
            JSON.stringify({ userId: user.id, status: "offline" })
          );
          client.disconnect();
        }
      };

      window.addEventListener("beforeunload", handleTabClose);

      return () => {
        handleTabClose();
        window.removeEventListener("beforeunload", handleTabClose);
      };
    });
  }, [user.id]);

  return (
    <>
      {user?.role?.name !== "Customer" ? <Card /> : ""}

      <div className="flex flex-col xl:flex-row my-3 gap-3">
        <CustomBarChart
          user={user}
          listPayments={listPayments}
          listElectricityUsages={listElectricityUsages}
        />
      </div>

      {user?.role?.name !== "Customer" ? (
        <div className="flex flex-col xl:flex-row gap-3">
          <Tables listPayments={listPayments} />
          <Activity listUsers={listUsers} userStatus={userStatus} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Dashboard;
