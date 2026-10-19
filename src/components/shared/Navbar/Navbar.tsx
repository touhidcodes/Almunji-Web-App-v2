"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserInfo } from "@/hooks/useUserInfo";
import { userLogout } from "@/services/actions/logoutUser";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Check,
  ChevronRight,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  BookOpenText,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/surahs", label: "Quran", icon: BookOpenText },
  { href: "/dictionary", label: "Dictionary", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, loading } = useUserInfo();
  const router = useRouter();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user) return "/auth";

    if (user.role === "ADMIN") {
      return "/dashboard/admin/overview";
    }

    if (user.role === "MODERATOR") {
      return "/dashboard/moderator/overview";
    }

    return "/dashboard/user/overview";
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await userLogout();
      setIsOpen(false);
      router.push("/auth?type=login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileMenu = () => setIsOpen(false);

  const renderAuthActions = (mobile = false) => {
    if (loading || isLoggingOut) {
      return (
        <div
          className={cn(
            "flex items-center gap-2 text-sm text-gray-500",
            mobile && "w-full justify-center rounded-xl bg-gray-50 py-3",
          )}
        >
          <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
          {isLoggingOut ? "Signing out..." : "Loading account..."}
        </div>
      );
    }

    if (user) {
      return (
        <div
          className={cn(
            "flex items-center gap-2",
            mobile && "flex-col items-stretch",
          )}
        >
          <Link
            href={getDashboardLink()}
            onClick={mobile ? closeMobileMenu : undefined}
            className={cn(mobile && "w-full")}
          >
            <Button
              variant="outline"
              className={cn(
                "gap-2 rounded-xl border-teal-200 bg-white font-medium text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800",
                mobile ? "h-11 w-full justify-start px-4" : "h-10 px-4",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
              <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "gap-2 rounded-xl border-red-200 bg-white font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700",
              mobile ? "h-11 w-full justify-start px-4" : "h-10 px-4",
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2",
          mobile && "flex-col items-stretch",
        )}
      >
        <Link
          href="/auth?type=login"
          onClick={mobile ? closeMobileMenu : undefined}
          className={cn(mobile && "w-full")}
        >
          <Button
            variant="ghost"
            className={cn(
              "gap-2 rounded-xl font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700",
              mobile ? "h-11 w-full justify-start px-4" : "h-10 px-4",
            )}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
        </Link>

        <Link
          href="/auth?type=register"
          onClick={mobile ? closeMobileMenu : undefined}
          className={cn(mobile && "w-full")}
        >
          <Button
            className={cn(
              "gap-2 rounded-xl bg-teal-600 font-semibold text-white shadow-sm shadow-teal-200/60 transition-all hover:bg-teal-700 active:bg-teal-800",
              mobile ? "h-11 w-full justify-center" : "h-10 px-5",
            )}
          >
            Get started
            <Sparkles className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm shadow-gray-100/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Almunji home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-200/60 transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </span>

            <span className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Almunji
              </span>
              <span className="-mt-0.5 text-[10px] font-medium tracking-wider text-gray-400">
                YOUR QURAN COMPANION
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-teal-700",
                  )}
                >
                  {link.label}

                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-teal-600" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop authentication */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            {renderAuthActions()}
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-10 w-10 rounded-xl border-gray-200 bg-white text-gray-700 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-[300px] flex-col gap-0 border-l border-gray-200 bg-white p-0 sm:w-[350px]"
              >
                {/* Mobile header */}
                <SheetHeader className="border-b border-gray-100 bg-gray-50/70 px-5 py-5 text-left">
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2.5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-200/50">
                        <BookOpen className="h-5 w-5" />
                      </span>

                      <span className="text-xl font-bold tracking-tight text-gray-900">
                        Almunji
                      </span>
                    </Link>
                  </SheetTitle>

                  <SheetDescription className="pt-2 text-sm leading-relaxed text-gray-500">
                    Your companion for Quran reading, exploration, and learning.
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile links */}
                <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                  <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Navigation
                  </p>

                  {navigationLinks.map((link) => {
                    const active = isActive(link.href);
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                          active
                            ? "bg-teal-50 text-teal-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-teal-700",
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />

                        <span>{link.label}</span>

                        {active && (
                          <Check className="ml-auto h-4 w-4 text-teal-600" />
                        )}
                      </Link>
                    );
                  })}

                  {user && (
                    <>
                      <div className="my-5 border-t border-gray-100" />

                      <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        Your account
                      </p>

                      <Link
                        href={getDashboardLink()}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-xl bg-teal-50 px-3 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile auth actions */}
                <div className="space-y-3 border-t border-gray-100 bg-gray-50/70 p-4">
                  {renderAuthActions(true)}

                  <p className="pt-1 text-center text-xs text-gray-400">
                    Almunji · Your Quran companion
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
