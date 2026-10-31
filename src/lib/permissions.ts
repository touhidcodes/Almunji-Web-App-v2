import { Permission } from "@/types/permission";

export interface User {
  role?: string;
  permissions?: Permission[];
}

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  user: User,
  route: string,
  action: "read" | "create" | "update" | "delete" = "read"
): boolean => {
  // Admin has all permissions by default
  if (user.role === "ADMIN" || user.role === "SUPERADMIN" || user.role === "SUPER_ADMIN") {
    return true;
  }

  // Check specific permissions for non-admin users
  if (user.permissions && user.permissions.length > 0) {
    return user.permissions.some(
      (perm) => perm.route === route && (perm.action === action || perm.action === "read")
    );
  }

  return false;
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (
  user: User,
  routes: string[],
  action: "read" | "create" | "update" | "delete" = "read"
): boolean => {
  // Admin has all permissions
  if (user.role === "ADMIN" || user.role === "SUPERADMIN" || user.role === "SUPER_ADMIN") {
    return true;
  }

  return routes.some((route) => hasPermission(user, route, action));
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (
  user: User,
  route: string,
  action: "read" | "create" | "update" | "delete" = "read"
): boolean => {
  // Admin and User roles have access to all routes by default
  if (user.role === "ADMIN" || user.role === "SUPERADMIN" || user.role === "SUPER_ADMIN" || user.role === "USER") {
    return true;
  }

  // For other roles (like MODERATOR), check permissions
  return hasPermission(user, route, action);
};
