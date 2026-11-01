"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { getPermissionsCookie } from "./setPermissionsCookie";

export interface UserInfo {
  userId: string;
  email: string;
  role: string;
  permissions?: any[];
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    
    // If permissions are in the token, use those
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
        const permissions = JSON.parse(permissionsCookie);
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
