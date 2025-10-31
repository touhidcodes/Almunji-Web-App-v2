import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { decodedToken } from "@/utils/jwt-decode";

import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/local-storage";

interface DecodedToken {
  role?: string;
  // Add other properties from your JWT token
  userId?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}
//
export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  //   console.log(accessToken);
  return setToLocalStorage("accessToken", accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage("accessToken");
  //   console.log(authToken);
  if (authToken) {
    const decodedData = decodedToken(authToken) as DecodedToken;
    return {
      ...decodedData,
      role: decodedData?.role,
    };
  } else {
    return "";
  }
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage("accessToken");
  if (authToken) {
    return !!authToken;
  }
};

export const removeUser = () => {
  return removeFromLocalStorage("accessToken");
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/refresh-token`,
    // url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
