import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { setClientCookie } from "@/utils/clientCookies";

export const userLogin = async (data: FieldValues) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
    cache: "no-store",
  });
  const userInfo = await res.json();

  if (userInfo.success === false) {
    toast.error(userInfo.message || "Login failed");
    return userInfo;
  }

  if (userInfo.data?.token) {
    setClientCookie("accessToken", userInfo.data.token);
    toast.success("Login successful!");
  }

  return userInfo;
};
