"use client";

import Sidebar from "@/components/dashboard/Sidebar/SideBar";
import DashboardAuthButton from "@/components/shared/AuthButton/DashboardAuthButton";
import DynamicBreadcrumb from "@/components/shared/Breadcrumb/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PanelRightOpen,
  Search,
  Bell,
  CircleHelp,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        {/* Dashboard Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
          {/* Main navbar */}
          <div className="flex min-h-[68px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
            {/* Left section */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                className="shrink-0 rounded-xl text-gray-500 hover:bg-teal-50 hover:text-teal-700"
              >
                <PanelRightOpen
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    !sidebarOpen && "rotate-180",
                  )}
                />
              </Button>

              <div className="hidden h-8 w-px bg-gray-200 sm:block" />

              {/* Breadcrumb */}
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  href="/dashboard"
                  aria-label="Dashboard home"
                  className="hidden shrink-0 items-center justify-center rounded-lg bg-teal-50 p-2 text-teal-700 transition-colors hover:bg-teal-100 sm:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>

                <div className="flex min-w-0 items-center gap-2">
                  <ChevronRight className="hidden h-4 w-4 shrink-0 text-gray-300 sm:block" />

                  <div className="min-w-0 truncate text-sm font-semibold text-gray-800">
                    <DynamicBreadcrumb />
                  </div>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* Search */}
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("dashboard-search")?.focus()
                }
                className="hidden h-9 items-center gap-2 rounded-xl border-gray-200 bg-gray-50 px-3 text-gray-500 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 md:flex"
              >
                <Search className="h-4 w-4" />
                <input
                  id="dashboard-search"
                  aria-label="Search dashboard"
                  placeholder="Search..."
                  className="w-24 bg-transparent text-sm outline-none placeholder:text-gray-400 lg:w-32"
                  onClick={(event) => event.stopPropagation()}
                />
                <span className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 lg:inline">
                  /
                </span>
              </Button>

              {/* Help */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Help"
                className="rounded-xl text-gray-500 hover:bg-teal-50 hover:text-teal-700"
                onClick={() =>
                  window.open(
                    "mailto:support@almunji.com",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <CircleHelp className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative rounded-xl text-gray-500 hover:bg-teal-50 hover:text-teal-700"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

              {/* Auth / Logout */}
              <div className="shrink-0">
                <DashboardAuthButton />
              </div>
            </div>
          </div>

          {/* Secondary breadcrumb strip */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-4 py-2 sm:px-6 lg:px-7">
            <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="truncate">Almunji Workspace</span>
              <span className="text-gray-300">/</span>
              <span className="truncate font-medium text-gray-600">
                Dashboard
              </span>
            </div>

            <span className="hidden text-xs text-gray-400 sm:inline">
              Admin Panel
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
