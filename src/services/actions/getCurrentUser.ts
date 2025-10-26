"use server";

import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { authKey } from "@/constants/authKey";

type DecodedUser = JwtPayload & { role?: string };

export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const cookieStore = cookies();
  const token = cookieStore.get(authKey)?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedUser>(token);
    return { ...decoded, role: decoded.role || "" };
  } catch (err) {
    console.error("Failed to decode server token:", err);
    return null;
  }
};
