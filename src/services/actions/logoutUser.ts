"use server";

import { cookies } from "next/headers";

export const userLogout = async () => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", "", {
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("refreshToken", "", {
    path: "/",
    maxAge: 0,
  });

  // You can optionally return something
  return { success: true };
};
