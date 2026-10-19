"use client";

import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/hooks/useUserInfo";
import { userLogout } from "@/services/actions/logoutUser";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, Loader2, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextLoading from "../Loading/TextLoading";

interface AuthButtonProps {
  className?: string;
}

const AuthButton = ({ className }: AuthButtonProps) => {
  const router = useRouter();
  const { user, loading } = useUserInfo();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true);
      await userLogout();
      router.push("/auth");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (loading || isLoggingOut) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {isLoggingOut ? (
          <Button
            disabled
            variant="outline"
            className="gap-2 rounded-full border-teal-200 bg-teal-50 text-teal-700"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing out...</span>
          </Button>
        ) : (
          <TextLoading />
        )}
      </div>
    );
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-teal-200 bg-white px-4 font-medium text-teal-700 transition-colors hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800"
          >
            <UserRound className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>

        <Button
          onClick={handleLogOut}
          variant="outline"
          className="group gap-2 rounded-full border-red-200 bg-white px-4 font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <span>Log Out</span>
          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Link href="/auth">
        <Button
          variant="ghost"
          className="rounded-full px-4 font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
        >
          Login
        </Button>
      </Link>

      <Link href="/auth">
        <Button className="group gap-2 rounded-full bg-teal-600 px-5 font-semibold text-white shadow-sm shadow-teal-200 transition-all hover:bg-teal-700 hover:shadow-md active:bg-teal-800">
          <span>Get Started</span>
          <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;
