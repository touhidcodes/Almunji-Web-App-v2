import { authRole, TAuthRole } from "@/constants/authRoles";
import {
  PersonStanding,
  HomeIcon,
  ShoppingCart,
  LayoutDashboard,
  Users,
  Star,
  KeyRound,
} from "lucide-react";

// Type definition for the sidebar item
type SidebarGroup = {
  section: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
  }[];
};

export const getSidebarLinks = (role: TAuthRole): SidebarGroup[] => {
  const defaultItems = [
    {
      section: "Profile",
      items: [
        {
          label: "Profile",
          href: "/dashboard/profile",
          icon: PersonStanding,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          label: "Change Password",
          href: "/dashboard/change-password",
          icon: KeyRound,
        },
      ],
    },
  ];

  switch (role) {
    case authRole.ADMIN:
      return [
        {
          section: "Main",
          items: [
            {
              label: "Home",
              href: "/dashboard/admin/overview",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          section: "Manage",
          items: [
            {
              label: "Create Surah",
              href: "/dashboard/admin/create/surah",
              icon: HomeIcon,
            },
            {
              label: "Create Ayah",
              href: "/dashboard/admin/create/ayah",
              icon: HomeIcon,
            },
          ],
        },
        ...defaultItems,
      ];

    case authRole.USER:
      return [
        {
          section: "Main",
          items: [
            {
              label: "Home",
              href: "/dashboard/user/overview",
              icon: LayoutDashboard,
            },
          ],
        },
        {
          section: "My Activity",
          items: [
            {
              label: "Reviews",
              href: "/dashboard/user/bookmarks",
              icon: Star,
            },
          ],
        },
        ...defaultItems,
      ];

    default:
      return defaultItems;
  }
};
