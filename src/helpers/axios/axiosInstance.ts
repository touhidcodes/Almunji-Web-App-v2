import axios from "axios";
import { getNewAccessToken } from "@/services/auth.services";
import { getCookie, setCookie } from "@/utils/nextCookies";

// Create Axios instance
const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Token refresh state
let isRefreshing = false;
let refreshSubscribers = [] as ((token: string) => void)[];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// === Request Interceptor ===
instance.interceptors.request.use(
  async (config) => {
    const accessToken = await getCookie("accessToken");

    if (accessToken) {
      config.headers.Authorization = accessToken?.value;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Response Interceptor ===
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await getNewAccessToken();
          const newToken = res?.data?.accessToken;

          if (newToken) {
            await setCookie("refreshToken", newToken);
            onRefreshed(newToken);
            isRefreshing = false;
          }
        } catch (err) {
          isRefreshing = false;
          console.error("Token refresh failed:", err);
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newAccessToken) => {
          originalRequest.headers.Authorization = newAccessToken;
          resolve(instance(originalRequest));
        });
      });
    }

    // return Promise.reject({
    //   statusCode: error?.response?.status || 500,
    //   message: error?.response?.data?.message || "Something went wrong",
    //   errorMessages: error?.response?.data?.message || [],
    // });
    return Promise.reject(error);
  }
);

export { instance };
