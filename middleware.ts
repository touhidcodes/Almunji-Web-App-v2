import { authMiddleware } from "@/middleware/authMiddleware";

export { authMiddleware as middleware };

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
