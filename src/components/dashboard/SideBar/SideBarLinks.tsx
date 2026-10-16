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
  BookMarked,
  Heart,
  FolderOpen,
  Users,
  FileText,
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
          section: "Dashboard",
          items: [
            {
              label: "Overview",
              href: "/dashboard/admin/overview",
              icon: ChartPie,
            },
            {
              label: "System Logs",
              href: "/dashboard/admin/logs",
              icon: Logs,
            },
          ],
        },
        {
          section: "Quran Management",
          items: [
            {
              label: "Paras",
              href: "/dashboard/admin/manage/para",
              icon: BookOpen,
            },
            {
              label: "Surahs",
              href: "/dashboard/admin/manage/surah",
              icon: BookOpen,
            },
            {
              label: "Ayahs",
              href: "/dashboard/admin/manage/ayah",
              icon: BookOpen,
            },
          ],
        },
        {
          section: "Islamic Resources",
          items: [
            {
              label: "Duas",
              href: "/dashboard/admin/manage/dua",
              icon: Heart,
            },
            {
              label: "Dictionary",
              href: "/dashboard/admin/manage/dictionary",
              icon: Globe,
            },
            {
              label: "Books",
              href: "/dashboard/admin/manage/book",
              icon: BookMarked,
            },
          ],
        },
        {
          section: "Content Management",
          items: [
            {
              label: "Blogs",
              href: "/dashboard/admin/manage/blog",
              icon: FileText,
            },
            {
              label: "Categories",
              href: "/dashboard/admin/manage/category",
              icon: FolderOpen,
            },
          ],
        },
        {
          section: "User Management",
          items: [
            {
              label: "Users",
              href: "/dashboard/admin/manage/users",
              icon: Users,
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
              label: "Add Dictionary Word",
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
        ...defaultItems,
      ];

    case authRole.MODERATOR:
      return [
        {
          section: "Dashboard",
          items: [
            {
              label: "Overview",
              href: "/dashboard/moderator/overview",
              icon: ChartPie,
            },
          ],
        },
        {
          section: "Quran Management",
          items: [
            {
              label: "Paras",
              href: "/dashboard/moderator/manage/para",
              icon: BookOpen,
            },
            {
              label: "Surahs",
              href: "/dashboard/moderator/manage/surahs",
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
          ],
        },
        {
          section: "Islamic Resources",
          items: [
            {
              label: "Dictionary",
              href: "/dashboard/moderator/dictionary",
              icon: Globe,
            },
            {
              label: "Duas",
              href: "/dashboard/moderator/manage/dua",
              icon: Heart,
            },
            {
              label: "Books",
              href: "/dashboard/moderator/manage/book",
              icon: BookMarked,
            },
          ],
        },
        {
          section: "Content Management",
          items: [
            {
              label: "Categories",
              href: "/dashboard/moderator/manage/category",
              icon: FolderOpen,
            },
            {
              label: "Blogs",
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
          section: "Dashboard",
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
              icon: Heart,
            },
          ],
        },
        {
          section: "Resources",
          items: [
            {
              label: "Books",
              href: "/dashboard/user/readings",
              icon: BookMarked,
            },
          ],
        },
        ...defaultItems,
      ];

    default:
      return defaultItems;
  }
};
