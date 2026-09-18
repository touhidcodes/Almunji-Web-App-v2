import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";
import { toast } from "sonner";

export const userRegister = async (data: FieldValues) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const userInfo = await res.json();

  if (userInfo.success === false) {
    toast.error(userInfo.message || "Registration failed");
    return userInfo;
  }

  if (userInfo.data?.token) {
    setAccessToken(userInfo.data.token);
    toast.success("Registration successful!");
  }

  return userInfo;
};
