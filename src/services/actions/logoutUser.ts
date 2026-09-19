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

  return { success: true };
};
