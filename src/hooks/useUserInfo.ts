"use client";

import { getCurrentUser } from "@/services/actions/getCurrentUser";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  // Add any other fields you return from backend
}

export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await getCurrentUser();
      setUser(result as User);
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
};
