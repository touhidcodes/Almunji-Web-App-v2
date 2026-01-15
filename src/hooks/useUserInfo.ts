"use client";

import { getAuthUser } from "@/services/getAuthUser";
import { TUser } from "@/types/auth";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await getAuthUser();
      setUser(result);
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
};
