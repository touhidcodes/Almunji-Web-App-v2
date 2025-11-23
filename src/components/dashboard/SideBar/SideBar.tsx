"use client";

import { cn } from "@/lib/utils";
import { Mail, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { getSidebarLinks } from "./SideBarLinks";
import { useUserInfo } from "@/hooks/useUserInfo";

type SidebarProps = {
  isCollapsed: boolean;
  onClose: () => void;
};

export default function Sidebar({ isCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUserInfo();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // const fetchUnreadCount = async () => {
  //   try {
  //     const res = await fetchWithAuth("/api/messages/unread", {
  //       method: "GET",
  //     });

  //     const data = await res.json();
  //     console.log(data);

  //     if (res.ok && Array.isArray(data.data)) {
  //       setUnreadCount(data.data.length);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching unread message count:", err);
  //   }
  // };

  return (
    <>
      {/* Overlay shown only on mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "z-50 bg-white h-full shadow-md flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0",
          {
            "w-64": !isCollapsed, // Expanded sidebar for all sizes if not collapsed
            "lg:w-20 hidden lg:flex": isCollapsed, // Only show narrow sidebar on large screens
          }
        )}
      >
        {/* Top header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          {!isCollapsed ? (
            <>
              <Link href="/" className="text-lg font-semibold">
                APARTSOL
              </Link>
              <div className="relative flex items-center gap-3">
                <Link href="/dashboard/messages">
                  <Mail className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
              <button
                className="block lg:hidden"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="relative py-1">
              <Link href="/dashboard/messages">
                <Mail className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto">
          {getSidebarLinks((user?.role as "ADMIN" | "USER") || "USER").map(
            (group, idx) => (
              <div key={idx} className="mb-2">
                {/* Section Title - only show when sidebar is expanded */}
                {!isCollapsed && group.section !== "Main" && (
                  <div className="px-6 py-1 text-xs text-muted-foreground uppercase">
                    {group.section}
                  </div>
                )}

                {/* Divider when collapsed */}
                {isCollapsed && idx !== 0 && (
                  <div className="h-px bg-gray-400 mx-4 my-2" />
                )}

                {/* Nav Items */}
                <nav className="flex flex-col gap-0.5">
                  {group.items.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-muted transition",
                        pathname === item.href &&
                          "bg-secondary text-secondary-foreground",
                        isCollapsed && "justify-center px-0"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && (
                        <span className="transition-opacity duration-200">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {!isCollapsed ? (
          <div className="px-6 py-4 border-t flex items-center gap-3 shrink-0 bg-white">
            <Image
              src="https://github.com/shadcn.png"
              alt="user"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <div className="font-medium">
                {user ? user?.username : "shadcn"}
              </div>
              <div className="text-muted-foreground text-xs">
                {user ? user?.email : "m@example.com"}
              </div>
            </div>
            <MoreHorizontal className="ml-auto w-4 h-4" />
          </div>
        ) : (
          <div className="px-4 py-4 border-t flex justify-center bg-white">
            <Popover>
              <PopoverTrigger asChild>
                <Image
                  src="https://github.com/shadcn.png"
                  alt="user"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-40 p-2">
                <div className="text-sm font-medium">
                  {user ? user?.username : "shadcn"}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {user ? user?.email : "m@example.com"}
                </div>
                <Link
                  href="/dashboard/settings"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Settings
                </Link>
                <br />
                {/* <LogoutButton /> */}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </aside>
    </>
  );
}
