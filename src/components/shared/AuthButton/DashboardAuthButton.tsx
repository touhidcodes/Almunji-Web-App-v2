import { Button } from "@/components/ui/button";
// import { useUserInfo } from "@/hooks/useUserInfo";
import { userLogout } from "@/services/actions/logoutUser";
import { Loader2, LogOut, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DashboardAuthButton = () => {
  const router = useRouter();
  // const userInfo = useUserInfo();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await userLogout();
    router.push("/");
  };

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-gray-50/95 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-xl shadow-gray-200/50">
          {/* Logo */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200/60">
            <LogOut className="h-6 w-6" />
          </div>

          {/* Loading indicator */}
          <div className="relative mx-auto mb-5 flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-teal-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-teal-600" />
            <Loader2 className="h-4 w-4 text-teal-600 opacity-70" />
          </div>

          {/* Message */}
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Signing you out
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Safely ending your session. Please wait a moment...
          </p>

          {/* Status indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            <span className="text-xs font-medium text-gray-400">
              Securing your account
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Button
      onClick={handleLogOut}
      variant="outline"
      className="gap-2 rounded-xl text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
    >
      <span className="font-medium">Log Out</span>
      <LogOutIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  );
};

export default DashboardAuthButton;
