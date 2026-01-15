"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
