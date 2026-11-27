"use client";

import { useEffect, useState } from "react";
import { getPermissions } from "@/services/actions/getPermissions";
import { hasPermissionAccess } from "@/middleware/authMiddleware";
import type { Permission } from "@/types/permission";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const result = await getPermissions();
        setPermissions(result || []);
      } catch (error) {
        console.error("Failed to load permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, []);

  // Helper function to check if user has specific permission
  const hasPermission = (route: string, action: "read" | "create" | "update" | "delete" = "read") => {
    return hasPermissionAccess(route, permissions);
  };

  // Helper function to check if user has any of the specified permissions
  const hasAnyPermission = (routes: string[], action: "read" | "create" | "update" | "delete" = "read") => {
    return routes.some((route) => hasPermission(route, action));
  };

  return { permissions, loading, hasPermission, hasAnyPermission };
};
