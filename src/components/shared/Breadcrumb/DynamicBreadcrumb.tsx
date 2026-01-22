"use client";

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  "all-user": "All Users",
  "my-profile": "My Profile",
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "user" && segment !== "admin");

  const breadcrumbs = pathSegments.map((segment) => {
    const label =
      labelMap[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { label };
  });

  return (
    <Breadcrumb className="flex items-center space-x-1 text-white text-sm lg:text-md list-none">
      <BreadcrumbLink
        href="/"
        className="text-white no-underline hover:text-white"
      >
        Home
      </BreadcrumbLink>

      {breadcrumbs.map((crumb, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <BreadcrumbSeparator className="text-white" />
          <span
            className="text-white font-normal select-none no-underline"
            aria-current={idx === breadcrumbs.length - 1 ? "page" : undefined}
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </Breadcrumb>
  );
}
