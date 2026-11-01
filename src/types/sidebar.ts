export interface Permission {
  route: string;
  action: "read" | "create" | "update" | "delete";
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission?: {
    route: string;
    action?: "read" | "create" | "update" | "delete";
  };
}

export interface SidebarGroup {
  section: string;
  items: SidebarItem[];
}
