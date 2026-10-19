"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserInfo } from "@/hooks/useUserInfo";

export const useAuth = () => {
  const { user, loading } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};

export const useRole = (allowedRoles: string[]) => {
  const { user, loading } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    const userRole = user.role?.toUpperCase();

    if (!userRole || !allowedRoles.includes(userRole)) {
      if (userRole === "ADMIN") {
        router.replace("/dashboard/admin/overview");
      } else if (userRole === "MODERATOR") {
        router.replace("/dashboard/moderator/overview");
      } else {
        router.replace("/dashboard/user/overview");
      }
    }
  }, [user, loading, allowedRoles, router]);

  return { user, loading };
};
