import SockJS from "sockjs-client";
import Stomp from "stompjs";

const URL = `${import.meta.env.VITE_BACKEND_URL}/ws`;
let stompClient = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

export const WebSocketService = {
  connect: (onMessageReceived, setLoading, setError) => {
    if (setLoading) setLoading(true);

    const socket = new SockJS(URL);
    stompClient = Stomp.over(socket);
    stompClient.debug = null;

    const connectTimeout = setTimeout(() => {
      socket.close();
      WebSocketService.reconnect(onMessageReceived, setLoading, setError);
    }, 5000);

    stompClient.connect(
      {},
      () => {
        clearTimeout(connectTimeout);

        // message.success("Kết nối thành công");
        console.clear()
        
        reconnectAttempts = 0;
        if (setLoading) setLoading(false);

        socket.onclose = () => {
          WebSocketService.reconnect(onMessageReceived, setLoading, setError);
        };
      },
      (error) => {
        clearTimeout(connectTimeout);
        WebSocketService.reconnect(onMessageReceived, setLoading, setError);
      }
    );
  },

  disconnect: () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
    }
  },

  reconnect: (onMessageReceived, setLoading, setError) => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      setTimeout(() => {
        WebSocketService.connect(onMessageReceived, setLoading, setError);
      }, 3000 * reconnectAttempts);
    } else {
      setError(true);
      if (setLoading) setLoading(false);
    }
  },
};
