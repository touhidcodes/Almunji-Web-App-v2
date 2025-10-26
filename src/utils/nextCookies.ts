"use server";

import { cookies } from "next/headers";

const cookieStore = cookies();

// Function to set a cookie
export const setCookie = async (key: string, value: string) => {
  const cookieStore = await cookies();

  if (!key && !value) {
    return;
  }

  cookieStore.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

// Function to get a cookie
export const getCookie = async (key: string) => {
  if (!key) {
    return;
  }
  const authToken = cookieStore.get(key);
  return authToken;
};

// Function to remove a cookie
export const removeCookie = async (key: string) => {
  const cookieStore = await cookies();
  if (!key) {
    return;
  }
  cookieStore.delete(key);
};
