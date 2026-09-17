import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/lib/local-storage";
import { decodedToken } from "@/utils/jwt-decode";

interface DecodedToken {
  role?: string;
  userId?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}

export const getUserInfo = () => {
  const authToken = getFromLocalStorage("accessToken");
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
  return !!authToken;
};

export const removeUser = () => {
  return removeFromLocalStorage("accessToken");
};

export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/refresh-token`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
