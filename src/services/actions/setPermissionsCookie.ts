"use server";

import { cookies } from "next/headers";

export const setPermissionsCookie = async (permissions: any[]) => {
  const cookieStore = await cookies();
  cookieStore.set("permissions", JSON.stringify(permissions), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
};

export const getPermissionsCookie = async (): Promise<any[]> => {
  const cookieStore = await cookies();
  const permissions = cookieStore.get("permissions")?.value;
  
  if (!permissions) return [];
  
  try {
    return JSON.parse(permissions);
  } catch (err) {
    console.error("Failed to parse permissions cookie:", err);
    return [];
  }
};

export const clearPermissionsCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("permissions");
};
