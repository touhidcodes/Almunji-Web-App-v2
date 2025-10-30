"use server";

import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

type DecodedUser = JwtPayload & { role?: string };

export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedUser>(token);
    return { ...decoded, role: decoded.role || "" };
  } catch (err) {
    console.error("Failed to decode server token:", err);
    return null;
  }
};
