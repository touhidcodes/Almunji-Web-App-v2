import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { getCookie, setCookie } from "@/utils/nextCookies";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Lazy initialize instance
let instancePromise: Promise<AxiosInstance> | null = null;

const createInstance = async (): Promise<AxiosInstance> => {
  const instance = axios.create();

  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers["Accept"] = "application/json";
  instance.defaults.timeout = 60000;

  let isRefreshing = false;

  let refreshSubscribers: Array<(token: string) => void> = [];

  const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  const onRefreshFailed = () => {
    refreshSubscribers = [];
  };

  // Request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accessToken = await getCookie("accessToken");

      if (accessToken?.value) {
        config.headers.Authorization = `Bearer ${accessToken.value}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableAxiosRequestConfig
        | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Refresh only when the API returns 401
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            if (typeof window === "undefined") {
              return Promise.reject(error);
            }

            const { getNewAccessToken } =
              await import("@/services/auth.services");

            const response = await getNewAccessToken();
            const newToken = response?.data?.accessToken;

            if (!newToken) {
              throw new Error("Unable to retrieve a new access token");
            }

            await setCookie("accessToken", newToken);

            isRefreshing = false;
            onRefreshed(newToken);

            return instance.request({
              ...originalRequest,
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
              },
            });
          } catch (refreshError) {
            isRefreshing = false;
            onRefreshFailed();

            console.error("Token refresh failed:", refreshError);

            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            resolve(instance.request(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Get Axios instance
export const getInstance = async (): Promise<AxiosInstance> => {
  if (!instancePromise) {
    instancePromise = createInstance();
  }

  return instancePromise;
};

// Typed Axios wrapper
export const instance = {
  request: async <T = unknown>(config: AxiosRequestConfig) => {
    const inst = await getInstance();
    return inst.request<T>(config);
  },

  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const inst = await getInstance();
    return inst.get<T>(url, config);
  },

  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const inst = await getInstance();
    return inst.post<T>(url, data, config);
  },

  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const inst = await getInstance();
    return inst.put<T>(url, data, config);
  },

  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const inst = await getInstance();
    return inst.patch<T>(url, data, config);
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const inst = await getInstance();
    return inst.delete<T>(url, config);
  },
};
