"use client";

import { useEffect, useState } from "react";
import { getPermissions } from "@/services/actions/getPermissions";

export interface Permission {
  route: string;
  action: "read" | "create" | "update" | "delete";
}

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
    return permissions.some(
      (perm) => perm.route === route && (perm.action === action || perm.action === "read")
    );
  };

  // Helper function to check if user has any of the specified permissions
  const hasAnyPermission = (routes: string[], action: "read" | "create" | "update" | "delete" = "read") => {
    return routes.some((route) => hasPermission(route, action));
  };

  return { permissions, loading, hasPermission, hasAnyPermission };
};
