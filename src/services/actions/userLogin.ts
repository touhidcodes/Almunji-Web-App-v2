"use server";

import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";

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
    return userInfo;
  }

  if (userInfo.data?.token) {
    await setAccessToken(userInfo.data.token);
    return { success: true, message: userInfo.message, authenticated: true };
  }

  return { success: false, message: userInfo.message || "Login failed", authenticated: false };
};
