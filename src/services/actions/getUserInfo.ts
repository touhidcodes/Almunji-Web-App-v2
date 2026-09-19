"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface UserInfo {
  userId: string;
  email: string;
  role: string;
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded as UserInfo;
  } catch {
    return null;
  }
}
