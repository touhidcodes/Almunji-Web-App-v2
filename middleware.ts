import { NextRequest, NextResponse } from "next/server";

import {
  decodeAccessToken,
  getUserPermissions,
  hasPermissionAccess,
  hasRoleAccess,
} from "@/middleware/authMiddleware";

const ACCESS_TOKEN_COOKIE = "accessToken";
const PERMISSIONS_COOKIE = "permissions";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth?type=login", request.url));
    }

    const decodedToken = decodeAccessToken(accessToken);

    if (!decodedToken?.role) {
      const response = NextResponse.redirect(
        new URL("/auth?type=login", request.url),
      );

      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(PERMISSIONS_COOKIE);

      return response;
    }

    const { role } = decodedToken;

    // Profile pages are available to every signed-in dashboard role.
    const sharedRoute = pathname === "/dashboard/profile" || pathname === "/dashboard/change-password";
    if (!sharedRoute && !hasRoleAccess(role, pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Fetch current grants from the backend; cookies are display hints, not authority.
    if (role === "MODERATOR") {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
      let permissions;
      try {
        const result = await fetch(`${baseUrl.replace(/\/$/, "")}/user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (!result.ok) return NextResponse.redirect(new URL("/auth?type=login", request.url));
        const payload = await result.json();
        const user = payload?.data?.user ?? payload?.data;
        if (user?.role !== "MODERATOR" || user?.status !== "ACTIVE") {
          return NextResponse.redirect(new URL("/", request.url));
        }
        const grantsResponse = await fetch(`${baseUrl.replace(/\/$/, "")}/permission/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (!grantsResponse.ok) return NextResponse.redirect(new URL("/auth?type=login", request.url));
        const grantsPayload = await grantsResponse.json();
        if (!Array.isArray(grantsPayload?.data)) return NextResponse.redirect(new URL("/auth?type=login", request.url));
        permissions = getUserPermissions(grantsPayload.data);
      } catch {
        return NextResponse.redirect(new URL("/auth?type=login", request.url));
      }

      if (!hasPermissionAccess(pathname, permissions)) {
        return NextResponse.redirect(
          new URL("/dashboard/moderator/overview", request.url),
        );
      }
    }
  }

  // Redirect authenticated users away from the auth page
  if (pathname === "/auth" && accessToken) {
    const decodedToken = decodeAccessToken(accessToken);

    if (decodedToken?.role) {
      const dashboardRoutes: Record<string, string> = {
        SUPERADMIN: "/dashboard/admin/overview",
        ADMIN: "/dashboard/admin/overview",
        MODERATOR: "/dashboard/moderator/overview",
        USER: "/dashboard/user/overview",
      };

      const redirectPath = dashboardRoutes[decodedToken.role];

      if (redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
