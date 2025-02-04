import { useContext, useEffect, useRef, useState } from "react";
import { message, notification } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { AuthContext } from "./Context";
import {
  callGetAllNotificationMaintenances,
  callGetAllNotifications,
  callGetChatRoomGroups,
  callGetChatRoomUsers,
} from "../../services/api";

const useWebSocket = () => {
  const stompClientRef = useRef(null);

  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [listNotifications, setListNotifications] = useState([]);
  const [listChatRoomUsers, setListChatRoomUsers] = useState([]);
  const [listChatRoomGroups, setListChatRoomGroups] = useState([]);

  const fetchNotifications = async () => {
    setLoading(true);

    const [res1, res2] = await Promise.all([
      callGetAllNotifications(),
      callGetAllNotificationMaintenances(),
    ]);

    const allResults = [...res1.data.result, ...res2.data.result];

    setListNotifications(
      allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);

    const res = await callGetChatRoomUsers();
    if (res && res.data && res.statusCode === 200) {
      setListChatRoomUsers(res.data.result);
    }

    const res1 = await callGetChatRoomGroups();
    if (res1 && res1.data && res1.statusCode === 200) {
      setListChatRoomGroups(res1.data.result);
    }

    setLoading(false);
  };

  const connectWebSocket = () => {
    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const stompClient = Stomp.over(sock);
    stompClientRef.current = stompClient;

    stompClient.debug = () => {};

    const topics = [
      `/topic/paymentNotifications/${user?.id}`,
      `/topic/electricityUsageVerification/${user?.id}`,
      `/topic/maintenance/${user?.id}`,
      `/topic/admin/work-registrations/${user?.id}`,
      `/topic/messages/${user?.id}`,
    ];

    stompClient.connect(
      {},
      () => {
        topics.forEach((topic) => {
          stompClient.subscribe(topic, (messageOutput) => {
            const newMessage = JSON.parse(messageOutput.body);

            fetchNotifications();

            setListNotifications((prevMessages) => [
              ...prevMessages,
              { ...newMessage },
            ]);

            if (topic.includes("messages")) {
              message.success("Bạn có một tin nhắn mới. Vui lòng kiểm tra.");
            } else {
              notification.success({
                message: "Thông báo",
                description: "Bạn có một thông báo mới. Vui lòng kiểm tra.",
              });
            }
          });
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        console.log("WebSocket disconnected");
      }
    };
  }, [user?.id]);

  return {
    user,
    loading,
    setLoading,
    listNotifications,
    setListNotifications,
    fetchNotifications,
    fetchData,
    listChatRoomUsers,
    setListChatRoomUsers,
    listChatRoomGroups,
    setListChatRoomGroups,
  };
};

export default useWebSocket;
