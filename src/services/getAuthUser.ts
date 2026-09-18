import { jwtDecode } from "jwt-decode";
import { getClientCookie } from "@/utils/clientCookies";

export async function getAuthUser() {
  const token = getClientCookie("accessToken");
  
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded as {
      userId: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
