// "use server";

import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { setCookie } from "@/utils/nextCookies";
import { authKey } from "@/constants/authKey";

export const userLogin = async (data: FieldValues) => {
  // TODO: change URL before build
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/login`, {
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
    toast.error(userInfo.message);
  }

  if (userInfo.data.token) {
    setCookie(authKey, userInfo.data.token);
  }

  return userInfo;
};
