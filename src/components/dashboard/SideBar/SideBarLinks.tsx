import { authRole, TAuthRole } from "@/constants/authRoles";
import {
  PersonStanding,
  HomeIcon,
  LayoutDashboard,
  Star,
  KeyRound,
  FormInput,
  FormInputIcon,
  FilePlus2,
  FilePen,
  ChartPie,
  User,
  KeySquare,
  Logs,
  Bookmark,
} from "lucide-react";

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
          icon: User,
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          label: "Change Password",
          href: "/dashboard/change-password",
          icon: KeySquare,
        },
      ],
    },
  ];

  switch (role) {
    case authRole.ADMIN:
      return [
        {
          section: "Analytics",
          items: [
            {
              label: "Overview",
              href: "/dashboard/admin/overview",
              icon: ChartPie,
            },
            {
              label: "Logs",
              href: "/dashboard/admin/logs",
              icon: Logs,
            },
          ],
        },
        {
          section: "Create",
          items: [
            {
              label: "Add Para",
              href: "/dashboard/admin/create/para",
              icon: FilePlus2,
            },
            {
              label: "Add Surah",
              href: "/dashboard/admin/create/surah",
              icon: FilePlus2,
            },
            {
              label: "Add Ayah",
              href: "/dashboard/admin/create/ayah",
              icon: FilePlus2,
            },
            {
              label: "Add Dua",
              href: "/dashboard/admin/create/ayah",
              icon: FilePlus2,
            },
            {
              label: "Add Words",
              href: "/dashboard/admin/create/dictionary",
              icon: FilePlus2,
            },
          ],
        },
        {
          section: "Manage",
          items: [
            {
              label: "Manage Para",
              href: "/dashboard/admin/manage/para",
              icon: FilePen,
            },
            {
              label: "Manage Surah",
              href: "/dashboard/admin/manage/surah",
              icon: FilePen,
            },
            {
              label: "Manage Ayah",
              href: "/dashboard/admin/manage/ayah",
              icon: FilePen,
            },
            {
              label: "Manage Dua",
              href: "/dashboard/admin/manage/ayah",
              icon: FilePen,
            },
            {
              label: "Manage Words",
              href: "/dashboard/admin/manage/dictionary",
              icon: FilePen,
            },
          ],
        },
        ...defaultItems,
      ];

    case authRole.USER:
      return [
        {
          section: "Analytics",
          items: [
            {
              label: "Overview",
              href: "/dashboard/user/overview",
              icon: ChartPie,
            },
          ],
        },
        {
          section: "My Activity",
          items: [
            {
              label: "Saved Items",
              href: "/dashboard/user/bookmarks",
              icon: Bookmark,
            },
            {
              label: "Daily Duas",
              href: "/dashboard/user/daily",
              icon: Bookmark,
            },
          ],
        },
        {
          section: "Resources",
          items: [
            {
              label: "Books",
              href: "/dashboard/user/readings",
              icon: Bookmark,
            },
          ],
        },
        ...defaultItems,
      ];

    default:
      return defaultItems;
  }
};
