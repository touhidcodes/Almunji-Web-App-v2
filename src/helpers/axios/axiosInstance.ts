import axios from "axios";

// Lazy initialize instance to avoid server-side localStorage errors
let instancePromise: Promise<axios.AxiosInstance> | null = null;

const createInstance = async (): Promise<axios.AxiosInstance> => {
  const instance = axios.create();
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers["Accept"] = "application/json";
  instance.defaults.timeout = 60000;

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  };

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      if (typeof window !== "undefined") {
        const { getCookie } = await import("@/utils/nextCookies");
        const accessToken = await getCookie("accessToken");
        if (accessToken) {
          config.headers.Authorization = accessToken.value;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error?.response?.status === 500 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            if (typeof window !== "undefined") {
              const { getNewAccessToken } = await import("@/services/auth.services");
              const res = await getNewAccessToken();
              const newToken = res?.data?.accessToken;

              if (newToken) {
                const { setCookie } = await import("@/utils/nextCookies");
                await setCookie("refreshToken", newToken);
                onRefreshed(newToken);
                isRefreshing = false;
              }
            } else {
              isRefreshing = false;
              return Promise.reject(error);
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
            resolve(instance.request(originalRequest));
          });
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const getInstance = async (): Promise<axios.AxiosInstance> => {
  if (!instancePromise) {
    instancePromise = createInstance();
  }
  return instancePromise;
};

export const instance = {
  request: async (config: any) => {
    const inst = await getInstance();
    return inst.request(config);
  },
  get: async (url: string, config?: any) => {
    const inst = await getInstance();
    return inst.get(url, config);
  },
  post: async (url: string, data?: any, config?: any) => {
    const inst = await getInstance();
    return inst.post(url, data, config);
  },
  put: async (url: string, data?: any, config?: any) => {
    const inst = await getInstance();
    return inst.put(url, data, config);
  },
  delete: async (url: string, config?: any) => {
    const inst = await getInstance();
    return inst.delete(url, config);
  },
};
