import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { getClientCookie } from "@/utils/clientCookies";

interface DecodedToken {
  role?: string;
  userId?: string;
  exp?: number;
  [key: string]: unknown;
}

const protectedRoutes = ["/dashboard"];
const adminOnlyRoutes = [
  "/dashboard/admin",
  "/dashboard/admin/create",
  "/dashboard/admin/manage",
  "/dashboard/admin/permissions",
];
const moderatorOnlyRoutes = [
  "/dashboard/moderator",
  "/dashboard/moderator/create",
  "/dashboard/moderator/manage",
];

export function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = getClientCookie("accessToken");

  // Public routes don't need auth
  if (!protectedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Decode token to check role
  let decoded: DecodedToken;
  try {
    decoded = jwtDecode(token);
  } catch {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  // Check if token is expired
  if (decoded.exp && Date.now() > decoded.exp * 1000) {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  const role = decoded.role?.toUpperCase();

  // Admin-only routes
  if (adminOnlyRoutes.some((route) => path.startsWith(route))) {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Moderator-only routes
  if (moderatorOnlyRoutes.some((route) => path.startsWith(route))) {
    if (!["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(role || "")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // All other protected routes (allow ADMIN, MODERATOR, USER)
  if (!["ADMIN", "SUPER_ADMIN", "MODERATOR", "USER"].includes(role || "")) {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
