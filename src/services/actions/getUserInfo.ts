"use server";

import { cookies } from "next/headers";
import { decodeAccessToken } from "@/middleware/authMiddleware";
import { Permission } from "@/types/permission";
import { getUserPermissions } from "@/middleware/authMiddleware";

export interface UserInfo {
  userId: string;
  email: string;
  role: string;
  permissions?: Permission[];
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = decodeAccessToken(token);
    if (!decoded?.userId || !decoded.email || !decoded.role) return null;
    
    if (decoded.role === "MODERATOR") {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/permission/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) return null;
      const payload = await response.json();
      if (!Array.isArray(payload?.data)) return null;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: getUserPermissions(payload.data),
      };
    }

    // Other roles retain their existing account flow.
    if (decoded.permissions) {
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions,
      };
    }
    
    // Otherwise try to get permissions from cookie
    const permissionsCookie = cookieStore.get("permissions")?.value;
    if (permissionsCookie) {
      try {
        const permissions = JSON.parse(permissionsCookie) as Permission[];
        return {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          permissions,
        };
      } catch (err) {
        console.error("Failed to parse permissions cookie:", err);
      }
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: [],
    };
  } catch {
    return null;
  }
}
