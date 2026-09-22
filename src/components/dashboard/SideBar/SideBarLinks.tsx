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
  BookOpen,
  Globe,
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
              href: "/dashboard/admin/create/dua",
              icon: FilePlus2,
            },
            {
              label: "Add Words",
              href: "/dashboard/admin/create/dictionary",
              icon: FilePlus2,
            },
            {
              label: "Add Blog",
              href: "/dashboard/admin/create/blog",
              icon: FilePlus2,
            },
            {
              label: "Add Category",
              href: "/dashboard/admin/create/category",
              icon: FilePlus2,
            },
            {
              label: "Add Book",
              href: "/dashboard/admin/create/book",
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
              href: "/dashboard/admin/manage/surahs",
              icon: FilePen,
            },
            {
              label: "Manage Ayah",
              href: "/dashboard/admin/manage/ayahs",
              icon: FilePen,
            },
            {
              label: "Manage Dua",
              href: "/dashboard/admin/manage/dua",
              icon: FilePen,
            },
            {
              label: "Manage Words",
              href: "/dashboard/admin/manage/dictionary",
              icon: FilePen,
            },
            {
              label: "Manage Blog",
              href: "/dashboard/admin/manage/blog",
              icon: FilePen,
            },
            {
              label: "Manage Category",
              href: "/dashboard/admin/manage/category",
              icon: FilePen,
            },
            {
              label: "Manage Book",
              href: "/dashboard/admin/manage/book",
              icon: FilePen,
            },
            {
              label: "Manage Users",
              href: "/dashboard/admin/manage/users",
              icon: User,
            },
            {
              label: "Permissions",
              href: "/dashboard/admin/permissions",
              icon: KeyRound,
            },
          ],
        },
        ...defaultItems,
      ];

    case authRole.MODERATOR:
      return [
        {
          section: "Analytics",
          items: [
            {
              label: "Overview",
              href: "/dashboard/moderator/overview",
              icon: ChartPie,
            },
          ],
        },
        {
          section: "Content Management",
          items: [
            {
              label: "Dictionary",
              href: "/dashboard/moderator/dictionary",
              icon: Globe,
            },
            {
              label: "Duas",
              href: "/dashboard/moderator/manage/dua",
              icon: BookOpen,
            },
            {
              label: "Surahs",
              href: "/dashboard/moderator/manage/surahs",
              icon: BookOpen,
            },
            {
              label: "Para",
              href: "/dashboard/moderator/manage/para",
              icon: BookOpen,
            },
            {
              label: "Ayahs",
              href: "/dashboard/moderator/manage/ayahs",
              icon: BookOpen,
            },
            {
              label: "Tafsir",
              href: "/dashboard/moderator/manage/tafsir",
              icon: BookOpen,
            },
            {
              label: "Books",
              href: "/dashboard/moderator/manage/book",
              icon: BookOpen,
            },
            {
              label: "Categories",
              href: "/dashboard/moderator/manage/category",
              icon: BookOpen,
            },
            {
              label: "Blog",
              href: "/dashboard/moderator/manage/blog",
              icon: FilePen,
            },
            {
              label: "Bookmarks",
              href: "/dashboard/moderator/manage/bookmarks",
              icon: Bookmark,
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
