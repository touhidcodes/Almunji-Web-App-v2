import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  userId?: string;
  permissions?: any[];
  exp?: number;
  [key: string]: unknown;
}

const protectedRoutes = ["/dashboard"];

// Route permission mapping for role-based access
const roleRoutes: Record<string, string[]> = {
  ADMIN: [
    "/dashboard/admin/overview",
    "/dashboard/admin/logs",
    "/dashboard/admin/manage",
    "/dashboard/admin/create",
    "/dashboard/admin/users",
  ],
  MODERATOR: [
    "/dashboard/moderator/overview",
    "/dashboard/moderator/manage",
    "/dashboard/moderator/dictionary",
    "/dashboard/moderator/bookmarks",
  ],
  USER: [
    "/dashboard/user/overview",
    "/dashboard/user/bookmarks",
    "/dashboard/user/daily",
    "/dashboard/user/readings",
  ],
};

export function authMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Get cookie from Next.js request (server-side)
  const token = request.cookies.get("accessToken")?.value;
  const permissionsCookie = request.cookies.get("permissions")?.value;

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

  // Decode token to check role and permissions
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
  const permissions = decoded.permissions || (permissionsCookie ? JSON.parse(permissionsCookie) : []);

  // Check if role has access to this route
  const allowedRoutes = roleRoutes[role] || [];
  
  // Check if path matches any allowed route
  const hasRouteAccess = allowedRoutes.some((route) => path.startsWith(route));

  if (!hasRouteAccess) {
    // For MODERATOR role, check specific permissions
    if (role === "MODERATOR" && permissions.length > 0) {
      const hasPermission = permissions.some((perm: any) => {
        return path.startsWith(perm.route) && 
               (perm.action === "read" || perm.action === "update" || perm.action === "delete" || perm.action === "create");
      });
      
      if (hasPermission) {
        return NextResponse.next();
      }
    }
    
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
