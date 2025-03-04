import { notification } from "antd";
import { Mutex } from "async-mutex";
import axios from "axios";
import { Navigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    const res = await instance.get("/api/auth/refresh");
    if (res && res.data) return res.data.access_token;
    else return null;
  });
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    // if (
    //   error.config &&
    //   error.response &&
    //   +error.response.status === 401 &&
    //   error.config.url !== "/api/auth/login" &&
    //   !error.config.headers[NO_RETRY_HEADER]
    // ) {
    //   const access_token = await handleRefreshToken();
    //   error.config.headers[NO_RETRY_HEADER] = "true";
    //   if (access_token) {
    //     error.config.headers["Authorization"] = `Bearer ${access_token}`;
    //     localStorage.setItem("access_token", access_token);
    //     return instance.request(error.config);
    //   }
    // }

    if (+error?.response?.status === 401) {
      localStorage.setItem("redirectedFromExpiredSession", "true");
      window.location.href = "/login";
      localStorage.removeItem("access_token");
    }

    if (+error?.response?.status === 403) {
      notification.error({
        message: "Error",
        description: "You do not have permission to access this information",
      });
    }

    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
