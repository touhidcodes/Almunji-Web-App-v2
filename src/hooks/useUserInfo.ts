import { getUserInfo } from "@/services/actions/getUserInfo";
import { UserInfo } from "@/services/actions/getUserInfo";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getUserInfo();
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
