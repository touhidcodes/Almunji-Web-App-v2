import { getAuthUser } from "@/services/getAuthUser";
import { TAuthUser } from "@/types/auth";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const [user, setUser] = useState<TAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getAuthUser();
        setUser(result);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};
