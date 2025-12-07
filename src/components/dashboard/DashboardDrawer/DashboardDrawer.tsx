"use client";

import AuthButton from "@/components/shared/AuthButton/AuthButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetSingleUserQuery,
  useGetUserWithProfileQuery,
} from "@/redux/api/userApi";
import clsx from "clsx";
import { Bell, Menu, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import Sidebar from "../Sidebar/SideBar";

export default function DashboardDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: userData, isLoading } = useGetSingleUserQuery({});
  const { data: userProfile } = useGetUserWithProfileQuery({});
  const placeholder =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUOdfo4lewXJYT_2xPo_Xu2Lj6XPn78X9UJA&s";

  return (
    <div className="flex min-h-screen bg-[#EBF0F4]">
      {/* Sidebar - Desktop */}
      <aside className="hidden sm:block w-[300px] border-r">
        <Sidebar isCollapsed={false} onClose={() => {}} />
      </aside>

      {/* Sidebar - Mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-black bg-opacity-40 sm:hidden transition-opacity",
          {
            hidden: !mobileOpen,
          }
        )}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-white border-r shadow-md transition-transform sm:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Sidebar isCollapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top App Bar */}
        <div className="sticky top-0 z-10 bg-[#EBF0F4] border-b px-4 py-3 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="sm:hidden"
          >
            <Menu className="text-muted-foreground" />
          </Button>

          <div className="flex-1 flex justify-between items-center">
            <div className="ml-2">
              <p className="text-sm text-muted-foreground">
                Hi, {isLoading ? "Loading..." : userData?.username}
              </p>
              <h1 className="text-xl font-semibold text-[#00026E]">
                Welcome to APARTSOL
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>

              <Avatar>
                <AvatarImage src={userProfile?.image || placeholder} />
                <AvatarFallback>
                  <UserCircle2 className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <AuthButton />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
