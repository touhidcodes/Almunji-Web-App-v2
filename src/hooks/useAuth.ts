import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserInfo } from "@/hooks/useUserInfo";

export const useAuth = () => {
  const { user, loading } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  return { user, loading, isAuthenticated: !!user };
};

export const useRole = (allowedRoles: string[]) => {
  const { user, loading } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const userRole = user.role?.toUpperCase();
      if (!allowedRoles.includes(userRole)) {
        router.push("/dashboard");
      }
    } else if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, allowedRoles, router]);

  return { user, loading };
};
