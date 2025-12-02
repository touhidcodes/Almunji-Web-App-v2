"use client";

import { getCurrentUser } from "@/services/actions/getCurrentUser";
import { useState, useEffect } from "react";

export const useUserInfo = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await getCurrentUser();
      setUser(result);
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
};
