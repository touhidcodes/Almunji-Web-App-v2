import { removeClientCookie } from "@/utils/clientCookies";

export const userLogout = async () => {
  removeClientCookie("accessToken");
  removeClientCookie("refreshToken");
  return { success: true };
};
