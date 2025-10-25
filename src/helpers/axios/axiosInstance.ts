import { authKey } from "@/constants/authKey";
import setAccessToken from "@/services/actions/setAccessToken";
import { getNewAccessToken } from "@/services/auth.services";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Token refresh logic
let isRefreshing = false; // To prevent multiple refresh calls
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add subscribers to pending requests
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify all subscribers after token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    const accessToken = Cookies.get(authKey);
    // console.log(accessToken);

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  //@ts-ignore
  (response) => {
    const responseObject: ResponseSuccessType = {
      data: response?.data,
      meta: response?.data?.meta,
    };
    // console.log(response);
    return responseObject;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 500 and token-related errors
    if (error?.response?.status === 500 && !originalRequest._retry) {
      // Prevent infinite retry loops
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await getNewAccessToken(); // Fetch a new access token
          const newAccessToken = response?.data?.accessToken;

          if (newAccessToken) {
            // Update access token in storage and set it globally
            setAccessToken(newAccessToken);
            setToLocalStorage(authKey, newAccessToken);

            // Set new token to the failed request's Authorization header
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Resolve all requests waiting for token refresh
            onRefreshed(newAccessToken);

            return instance(originalRequest); // Retry the failed request
          }
        } catch (error) {
          // Handle error cases
          console.error("Error refreshing token:", error);
        } finally {
          isRefreshing = false; // Reset the refreshing flag
        }
      }

      // Return pending requests once refresh is done
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(instance(originalRequest)); // Retry with new token
        });
      });
    }

    // Handle other errors
    const responseObject: IGenericErrorResponse = {
      statusCode: error?.response?.data?.statusCode,
      message: error?.response?.data?.message,
      errorMessages: error?.response?.data?.message,
    };

    return Promise.reject(responseObject); // Reject error
  }
);

export { instance };
