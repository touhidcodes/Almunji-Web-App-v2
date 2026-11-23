import { NextRequest, NextResponse } from "next/server";

import {
  decodeAccessToken,
  getUserPermissions,
  hasPermissionAccess,
  hasRoleAccess,
} from "@/middleware/authMiddleware";

const ACCESS_TOKEN_COOKIE = "accessToken";
const PERMISSIONS_COOKIE = "permissions";

export function middleware(request: NextRequest) {
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

    const { role, permissions: tokenPermissions } = decodedToken;

    // Check role-based access
    if (!hasRoleAccess(role, pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check additional permissions for moderators
    if (role === "MODERATOR") {
      const permissions = getUserPermissions(
        tokenPermissions,
        request.cookies.get(PERMISSIONS_COOKIE)?.value,
      );

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
