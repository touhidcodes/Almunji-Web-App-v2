"use client";

import { getCurrentUser } from "@/services/actions/getCurrentUser";
import { TUser } from "@/types/auth";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await getCurrentUser();
      setUser(result as TUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
};
