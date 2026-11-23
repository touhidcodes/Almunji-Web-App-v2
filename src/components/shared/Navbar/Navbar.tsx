"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  Home,
  BookOpen,
  BookOpenText,
  BookMarked,
  Library,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ChevronRight,
  Check,
  Sparkles,
  Loader2,
  HeartHandshake,
} from "lucide-react";

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/surahs", label: "Quran", icon: BookOpenText },
  { href: "/dictionary", label: "Dictionary", icon: BookOpen },
  { href: "/books", label: "Books", icon: BookMarked },
  { href: "/duas", label: "Duas", icon: HeartHandshake },
  { href: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, loading } = useUserInfo();

  const router = useRouter();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user) return "/auth?type=login";

    switch (user.role) {
      case "SUPERADMIN":
      case "ADMIN":
        return "/dashboard/admin/overview";

      case "MODERATOR":
        return "/dashboard/moderator/overview";

      default:
        return "/dashboard/user/overview";
    }
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
    const buttonLayout = mobile
      ? "h-11 w-full justify-center rounded-xl"
      : "h-10 rounded-xl";

    if (loading || isLoggingOut) {
      return (
        <div
          className={cn(
            "flex items-center gap-2 text-sm text-gray-500",
            mobile && "justify-center rounded-xl bg-gray-50 py-3",
          )}
        >
          <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
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
                "group gap-2 border-emerald-200 bg-emerald-50/70 font-semibold text-emerald-900 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-950",
                buttonLayout,
                mobile ? "px-4" : "px-4",
              )}
            >
              <LayoutDashboard className="h-4 w-4 transition-transform group-hover:scale-110" />
              Dashboard
              {mobile && (
                <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "gap-2 font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700",
              buttonLayout,
              mobile ? "justify-start px-4" : "px-4",
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
              "gap-2 font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800",
              buttonLayout,
              mobile ? "justify-start px-4" : "px-4",
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
              "group gap-2 rounded-xl bg-emerald-800 font-semibold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-900 hover:shadow-lg active:scale-[0.98]",
              buttonLayout,
              mobile ? "justify-center" : "px-5",
            )}
          >
            Get started
            <Sparkles className="h-4 w-4 text-amber-300 transition-transform group-hover:rotate-12 group-hover:scale-110" />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 shadow-sm shadow-gray-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Almunji home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md shadow-emerald-900/15 transition-all duration-200 group-hover:scale-105 group-hover:bg-emerald-900">
              <BookOpen className="h-5 w-5" />
            </span>

            <span className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Almunji
              </span>

              <span className="-mt-0.5 text-[9px] font-semibold tracking-[0.16em] text-emerald-700">
                YOUR QURAN COMPANION
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200",
                    active
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-gray-600 hover:bg-emerald-50/70 hover:text-emerald-800",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-emerald-700" : "text-gray-400",
                    )}
                  />
                  {link.label}

                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-emerald-700" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop authentication */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {renderAuthActions()}
          </div>

          {/* Mobile navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-10 w-10 rounded-xl border-gray-200 bg-white text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-[300px] flex-col gap-0 border-l border-gray-200 bg-white p-0 sm:w-[350px]"
              >
                {/* Mobile header */}
                <SheetHeader className="border-b border-emerald-100 bg-emerald-50/50 px-5 py-6 text-left">
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2.5"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm">
                        <BookOpen className="h-5 w-5" />
                      </span>

                      <span className="text-xl font-bold tracking-tight text-gray-900">
                        Almunji
                      </span>
                    </Link>
                  </SheetTitle>

                  <SheetDescription className="pt-2 text-sm leading-relaxed text-gray-600">
                    Your companion for Quran reading, exploration, and learning.
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile links */}
                <div className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                  <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    Explore Almunji
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
                          "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                          active
                            ? "bg-emerald-50 text-emerald-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-emerald-800",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-500",
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>

                        <span>{link.label}</span>

                        {active && (
                          <Check className="ml-auto h-4 w-4 text-emerald-700" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile authentication */}
                <div className="space-y-4 border-t border-gray-100 bg-gray-50/70 p-4">
                  {renderAuthActions(true)}

                  <p className="text-center text-[11px] text-gray-400">
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
