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
    "/dashboard/moderator/create",
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

  const wrapper = value as Record<string, unknown>;
  const permission = (wrapper.permission && typeof wrapper.permission === "object"
    ? wrapper.permission
    : wrapper) as Record<string, unknown>;

  return (
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
    return tokenPermissions.map((item) => (item as { permission?: Permission }).permission ?? item).filter(isPermission);
  }

  if (!permissionsCookie) return [];

  try {
    const parsed: unknown = JSON.parse(permissionsCookie);

    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => item?.permission ?? item).filter(isPermission);
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
  if (path === "/dashboard/moderator/overview" || path === "/dashboard/profile" || path === "/dashboard/change-password") return true;
  const route = path.replace(/\/$/, "").split("/");
  if (route[1] !== "dashboard" || route[2] !== "moderator") return false;
  const section = route[3];
  const name = section === "dictionary" ? "dictionary" : route[4];
  const resourceByRoute: Record<string, string> = {
    para: "PARA", surahs: "SURAH", ayahs: "AYAH", tafsir: "TAFSIR",
    dictionary: "DICTIONARY", dua: "DUA", book: "BOOK", category: "BOOKCATEGORY",
    blog: "BLOG", bookmarks: "BOOKMARK",
  };
  const resource = resourceByRoute[name];
  const action = section === "create" ? "CREATE" : section === "manage" || section === "dictionary" ? "READ" : "";
  if (!resource || !action || route.length > (section === "dictionary" ? 4 : 5)) return false;
  return permissions.some((permission) =>
    permission.resource.toUpperCase() === resource && permission.action.toUpperCase() === action,
  );
};
