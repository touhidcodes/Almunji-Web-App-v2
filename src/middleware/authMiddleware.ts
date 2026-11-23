import { jwtDecode } from "jwt-decode";

import type { Permission } from "@/types/permission";

export interface DecodedToken {
  userId?: string;
  email?: string;
  role?: string;
  permissions?: Permission[];
  exp?: number;
  iat?: number;
}

const roleRoutes: Record<string, string[]> = {
  SUPERADMIN: ["/dashboard"],
  ADMIN: [
    "/dashboard/admin/overview",
    "/dashboard/admin/logs",
    "/dashboard/admin/manage",
    "/dashboard/admin/create",
    "/dashboard/admin/users",
  ],
  MODERATOR: [
    "/dashboard/moderator/overview",
    "/dashboard/moderator/manage",
    "/dashboard/moderator/dictionary",
    "/dashboard/moderator/bookmarks",
  ],
  USER: [
    "/dashboard/user/overview",
    "/dashboard/user/bookmarks",
    "/dashboard/user/daily",
    "/dashboard/user/readings",
  ],
};

const isPermission = (value: unknown): value is Permission => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const permission = value as Record<string, unknown>;

  return (
    typeof permission.id === "string" &&
    typeof permission.resource === "string" &&
    typeof permission.action === "string"
  );
};

export const decodeAccessToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);

    if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

export const getUserPermissions = (
  tokenPermissions?: Permission[],
  permissionsCookie?: string,
): Permission[] => {
  if (Array.isArray(tokenPermissions)) {
    return tokenPermissions.filter(isPermission);
  }

  if (!permissionsCookie) return [];

  try {
    const parsed: unknown = JSON.parse(permissionsCookie);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isPermission);
  } catch {
    return [];
  }
};

export const hasRouteAccess = (
  path: string,
  allowedRoutes: string[],
): boolean => {
  return allowedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
};

export const hasRoleAccess = (role: string, path: string): boolean => {
  const allowedRoutes = roleRoutes[role] ?? [];

  return hasRouteAccess(path, allowedRoutes);
};

export const hasPermissionAccess = (
  path: string,
  permissions: Permission[],
): boolean => {
  return permissions.some((permission) => {
    const resourceRoute = `/dashboard/admin/${permission.resource}`;

    return (
      hasRouteAccess(path, [resourceRoute]) &&
      ["read", "create", "update", "delete"].includes(permission.action)
    );
  });
};
