import { useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const useWebSocket = ({ userId }) => {
  useEffect(() => {
    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const stompClient = Stomp.over(sock);

    const topics = [
      `/topic/paymentNotifications/${userId}`,
      `/topic/electricityUsageVerification/${userId}`,
      `/topic/maintenance/${userId}`,
    ];

    stompClient.connect(
      {},
      () => {
        topics.forEach((topic) => {
          stompClient.subscribe(topic, (messageOutput) => {
            const newMessage = JSON.parse(messageOutput.body);
            setListNotifications((prevMessages) => [
              ...prevMessages,
              { ...newMessage },
            ]);

            notification.success({
              message: "Thông báo",
              description: "Bạn có một thông báo mới. Vui lòng kiểm tra.",
            });
          });
        });
      },
      (err) => {
        console.error("WebSocket Error:", err);
      }
    );

    return () => stompClient.disconnect();
  }, [userId]);
};

export default useWebSocket;
