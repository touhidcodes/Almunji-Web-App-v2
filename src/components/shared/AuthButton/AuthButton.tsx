"use client";

import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/hooks/useUserInfo";
import { userLogout } from "@/services/actions/logoutUser";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextLoading from "../Loading/TextLoading";

const AuthButton = () => {
  const router = useRouter();
  const { user, loading } = useUserInfo();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await userLogout();
    router.push("/auth");
  };

  if (isLoggingOut || loading) {
    return <TextLoading />;
  }

  return user ? (
    <Button
      onClick={handleLogOut}
      variant="outline"
      className="bg-transparent border-slate-600 text-white hover:bg-white hover:text-primary hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
    >
      <span className="font-medium">Log Out</span>
      <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  ) : (
    <Link href="/auth">
      <Button
        variant="outline"
        className="bg-transparent border-slate-600 text-white hover:bg-white hover:text-primary hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
      >
        <span className="font-medium">Login</span>
        <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </Link>
  );
};

export default AuthButton;
