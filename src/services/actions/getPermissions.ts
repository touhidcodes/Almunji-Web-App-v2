"use server";

import { cookies } from "next/headers";
import { getUserPermissions } from "@/middleware/authMiddleware";
import type { Permission } from "@/types/permission";

export const getPermissions = async (): Promise<Permission[]> => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/permission/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return [];
    const body = await response.json();
    return Array.isArray(body?.data) ? getUserPermissions(body.data) : [];
  } catch {
    return [];
  }
};
