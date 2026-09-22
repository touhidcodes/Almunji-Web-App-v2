"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserInfo } from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";
import { Mail, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { getSidebarLinks } from "./SidebarLinks";

type SidebarProps = {
  isCollapsed: boolean;
  onClose: () => void;
};

export default function Sidebar({ isCollapsed, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUserInfo();

  return (
    <>
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          "z-50 bg-white h-full shadow-md flex flex-col transition-all duration-300 fixed inset-y-0 left-0",
          { "w-64": !isCollapsed, "lg:w-20 hidden lg:flex": isCollapsed }
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          {!isCollapsed ? (
            <>
              <Link href="/" className="text-lg font-semibold text-teal-600">Almunji</Link>
              <button className="block lg:hidden" onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <Mail className="w-5 h-5 text-teal-600" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="space-y-3 px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            getSidebarLinks((user?.role as "ADMIN" | "MODERATOR" | "USER") || "USER").map((group, idx) => (
              <div key={idx} className="mb-1">
                {!isCollapsed && group.section !== "Main" && (
                  <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {group.section}
                  </div>
                )}

                {isCollapsed && idx !== 0 && <div className="h-px bg-gray-200 mx-4" />}

                <nav className="flex flex-col gap-1">
                  {group.items.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 transition-all duration-200",
                          isActive
                            ? "bg-teal-50 text-teal-700 font-semibold border border-teal-100"
                            : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", isActive && "text-teal-600")} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))
          )}
        </div>

        {!isCollapsed ? (
          <div className="px-6 py-4 border-t flex items-center gap-3 shrink-0 bg-gray-50/50">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
              {user?.role?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">{user?.role || "User"}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
        ) : (
          <div className="px-4 py-4 border-t flex justify-center bg-gray-50/50">
            <Popover>
              <PopoverTrigger className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                {user?.role?.charAt(0) || "U"}
              </PopoverTrigger>
              <PopoverContent align="center" side="top" className="w-48 p-3">
                <div className="font-medium text-sm text-gray-900">{user?.role || "User"}</div>
                <div className="text-xs text-gray-500 mb-3">{user?.email || "user@example.com"}</div>
                <Link href="/dashboard/settings" className="text-sm text-teal-600 hover:underline">
                  Settings
                </Link>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </aside>
    </>
  );
}
