import { authRole, TAuthRole } from "@/constants/authRoles";
import {
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
  FilePlus2,
  FilePen,
  ChartPie,
} from "lucide-react";

import { Permission, SidebarGroup, SidebarItem } from "@/types/sidebar";

// Route permission mappings
const routePermissions = {
  adminOverview: "/dashboard/admin/overview",
  adminLogs: "/dashboard/admin/logs",
  adminManagePara: "/dashboard/admin/manage/para",
  adminManageSurah: "/dashboard/admin/manage/surah",
  adminManageAyah: "/dashboard/admin/manage/ayah",
  adminManageTafsir: "/dashboard/admin/manage/tafsir",
  adminManageDua: "/dashboard/admin/manage/dua",
  adminManageDictionary: "/dashboard/admin/manage/dictionary",
  adminManageBook: "/dashboard/admin/manage/book",
  adminManageBlog: "/dashboard/admin/manage/blog",
  adminManageCategory: "/dashboard/admin/manage/category",
  adminManageUsers: "/dashboard/admin/manage/users",
  adminCreatePara: "/dashboard/admin/create/para",
  adminCreateSurah: "/dashboard/admin/create/surah",
  adminCreateAyah: "/dashboard/admin/create/ayah",
  adminCreateDua: "/dashboard/admin/create/dua",
  adminCreateDictionary: "/dashboard/admin/create/dictionary",
  adminCreateBlog: "/dashboard/admin/create/blog",
  adminCreateCategory: "/dashboard/admin/create/category",
  adminCreateBook: "/dashboard/admin/create/book",
  adminProfile: "/dashboard/profile",
  adminChangePassword: "/dashboard/change-password",
  
  moderatorOverview: "/dashboard/moderator/overview",
  moderatorManagePara: "/dashboard/moderator/manage/para",
  moderatorManageSurahs: "/dashboard/moderator/manage/surahs",
  moderatorManageAyahs: "/dashboard/moderator/manage/ayahs",
  moderatorManageTafsir: "/dashboard/moderator/manage/tafsir",
  moderatorDictionary: "/dashboard/moderator/dictionary",
  moderatorManageDua: "/dashboard/moderator/manage/dua",
  moderatorManageBook: "/dashboard/moderator/manage/book",
  moderatorManageCategory: "/dashboard/moderator/manage/category",
  moderatorManageBlog: "/dashboard/moderator/manage/blog",
  moderatorManageBookmarks: "/dashboard/moderator/manage/bookmarks",
  moderatorProfile: "/dashboard/profile",
  moderatorChangePassword: "/dashboard/change-password",
  
  userOverview: "/dashboard/user/overview",
  userBookmarks: "/dashboard/user/bookmarks",
  userDaily: "/dashboard/user/daily",
  userReadings: "/dashboard/user/readings",
  userProfile: "/dashboard/profile",
  userChangePassword: "/dashboard/change-password",
};

export const getSidebarLinks = (role: TAuthRole, permissions: Permission[] = []): SidebarGroup[] => {
  // Helper to check permission
  const hasPermission = (route: string, action: "read" | "create" | "update" | "delete" = "read") => {
    // Admin has all permissions by default
    if (role === "ADMIN") {
      return true;
    }
    return permissions.some((perm) => perm.route === route && (perm.action === action || perm.action === "read"));
  };

  // Filter items by permission
  const filterItems = (items: SidebarItem[]): SidebarItem[] => items.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission.route, item.permission.action);
  });

  // Filter sidebar group by permission
  const filterGroupItems = (group: SidebarGroup): SidebarGroup[] => {
    const filteredItems = group.items.filter((item) => {
      if (!item.permission) return true;
      return hasPermission(item.permission.route, item.permission.action);
    });
    
    // If all items are filtered out, return empty array
    if (filteredItems.length === 0) return [];
    
    return [{ ...group, items: filteredItems }];
  };

  const profileSettingsItems: SidebarGroup[] = filterGroupItems({
    section: "Profile",
    items: [
      {
        label: "Profile",
        href: routePermissions.adminProfile,
        icon: User,
        permission: { route: routePermissions.adminProfile, action: "read" },
      },
    ],
  });

  const settingsItem: SidebarGroup[] = filterGroupItems({
    section: "Settings",
    items: [
      {
        label: "Change Password",
        href: routePermissions.adminChangePassword,
        icon: KeySquare,
        permission: { route: routePermissions.adminChangePassword, action: "update" },
      },
    ],
  });

  switch (role) {
    case authRole.ADMIN:
      return [
        {
          section: "Dashboard",
          items: filterItems([
            {
              label: "Overview",
              href: routePermissions.adminOverview,
              icon: ChartPie,
              permission: { route: routePermissions.adminOverview, action: "read" },
            },
            {
              label: "System Logs",
              href: routePermissions.adminLogs,
              icon: Logs,
              permission: { route: routePermissions.adminLogs, action: "read" },
            },
          ]),
        },
        {
          section: "Quran Management",
          items: filterItems([
            {
              label: "Paras",
              href: routePermissions.adminManagePara,
              icon: BookOpen,
              permission: { route: routePermissions.adminManagePara, action: "read" },
            },
            {
              label: "Surahs",
              href: routePermissions.adminManageSurah,
              icon: BookOpen,
              permission: { route: routePermissions.adminManageSurah, action: "read" },
            },
            {
              label: "Ayahs",
              href: routePermissions.adminManageAyah,
              icon: BookOpen,
              permission: { route: routePermissions.adminManageAyah, action: "read" },
            },
            {
              label: "Tafsirs",
              href: routePermissions.adminManageTafsir,
              icon: BookOpen,
              permission: { route: routePermissions.adminManageTafsir, action: "read" },
            },
          ]),
        },
        {
          section: "Islamic Resources",
          items: filterItems([
            {
              label: "Duas",
              href: routePermissions.adminManageDua,
              icon: Heart,
              permission: { route: routePermissions.adminManageDua, action: "read" },
            },
            {
              label: "Dictionary",
              href: routePermissions.adminManageDictionary,
              icon: Globe,
              permission: { route: routePermissions.adminManageDictionary, action: "read" },
            },
            {
              label: "Books",
              href: routePermissions.adminManageBook,
              icon: BookMarked,
              permission: { route: routePermissions.adminManageBook, action: "read" },
            },
          ]),
        },
        {
          section: "Content Management",
          items: filterItems([
            {
              label: "Blogs",
              href: routePermissions.adminManageBlog,
              icon: FileText,
              permission: { route: routePermissions.adminManageBlog, action: "read" },
            },
            {
              label: "Categories",
              href: routePermissions.adminManageCategory,
              icon: FolderOpen,
              permission: { route: routePermissions.adminManageCategory, action: "read" },
            },
          ]),
        },
        {
          section: "User Management",
          items: filterItems([
            {
              label: "Users",
              href: routePermissions.adminManageUsers,
              icon: Users,
              permission: { route: routePermissions.adminManageUsers, action: "read" },
            },
          ]),
        },
        {
          section: "Create",
          items: filterItems([
            {
              label: "Add Para",
              href: routePermissions.adminCreatePara,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreatePara, action: "create" },
            },
            {
              label: "Add Surah",
              href: routePermissions.adminCreateSurah,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateSurah, action: "create" },
            },
            {
              label: "Add Ayah",
              href: routePermissions.adminCreateAyah,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateAyah, action: "create" },
            },
            {
              label: "Add Dua",
              href: routePermissions.adminCreateDua,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateDua, action: "create" },
            },
            {
              label: "Add Dictionary Word",
              href: routePermissions.adminCreateDictionary,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateDictionary, action: "create" },
            },
            {
              label: "Add Blog",
              href: routePermissions.adminCreateBlog,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateBlog, action: "create" },
            },
            {
              label: "Add Category",
              href: routePermissions.adminCreateCategory,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateCategory, action: "create" },
            },
            {
              label: "Add Book",
              href: routePermissions.adminCreateBook,
              icon: FilePlus2,
              permission: { route: routePermissions.adminCreateBook, action: "create" },
            },
          ]),
        },
        ...profileSettingsItems,
        ...settingsItem,
      ];

    case authRole.MODERATOR:
      return [
        {
          section: "Dashboard",
          items: filterItems([
            {
              label: "Overview",
              href: routePermissions.moderatorOverview,
              icon: ChartPie,
              permission: { route: routePermissions.moderatorOverview, action: "read" },
            },
          ]),
        },
        {
          section: "Quran Management",
          items: filterItems([
            {
              label: "Paras",
              href: routePermissions.moderatorManagePara,
              icon: BookOpen,
              permission: { route: routePermissions.moderatorManagePara, action: "read" },
            },
            {
              label: "Surahs",
              href: routePermissions.moderatorManageSurahs,
              icon: BookOpen,
              permission: { route: routePermissions.moderatorManageSurahs, action: "read" },
            },
            {
              label: "Ayahs",
              href: routePermissions.moderatorManageAyahs,
              icon: BookOpen,
              permission: { route: routePermissions.moderatorManageAyahs, action: "read" },
            },
            {
              label: "Tafsir",
              href: routePermissions.moderatorManageTafsir,
              icon: BookOpen,
              permission: { route: routePermissions.moderatorManageTafsir, action: "read" },
            },
          ]),
        },
        {
          section: "Islamic Resources",
          items: filterItems([
            {
              label: "Dictionary",
              href: routePermissions.moderatorDictionary,
              icon: Globe,
              permission: { route: routePermissions.moderatorDictionary, action: "read" },
            },
            {
              label: "Duas",
              href: routePermissions.moderatorManageDua,
              icon: Heart,
              permission: { route: routePermissions.moderatorManageDua, action: "read" },
            },
            {
              label: "Books",
              href: routePermissions.moderatorManageBook,
              icon: BookMarked,
              permission: { route: routePermissions.moderatorManageBook, action: "read" },
            },
          ]),
        },
        {
          section: "Content Management",
          items: filterItems([
            {
              label: "Categories",
              href: routePermissions.moderatorManageCategory,
              icon: FolderOpen,
              permission: { route: routePermissions.moderatorManageCategory, action: "read" },
            },
            {
              label: "Blogs",
              href: routePermissions.moderatorManageBlog,
              icon: FilePen,
              permission: { route: routePermissions.moderatorManageBlog, action: "read" },
            },
            {
              label: "Bookmarks",
              href: routePermissions.moderatorManageBookmarks,
              icon: Bookmark,
              permission: { route: routePermissions.moderatorManageBookmarks, action: "read" },
            },
          ]),
        },
        ...profileSettingsItems,
        ...settingsItem,
      ];

    case authRole.USER:
      return [
        {
          section: "Dashboard",
          items: filterItems([
            {
              label: "Overview",
              href: routePermissions.userOverview,
              icon: ChartPie,
              permission: { route: routePermissions.userOverview, action: "read" },
            },
          ]),
        },
        {
          section: "My Activity",
          items: filterItems([
            {
              label: "Saved Items",
              href: routePermissions.userBookmarks,
              icon: Bookmark,
              permission: { route: routePermissions.userBookmarks, action: "read" },
            },
            {
              label: "Daily Duas",
              href: routePermissions.userDaily,
              icon: Heart,
              permission: { route: routePermissions.userDaily, action: "read" },
            },
          ]),
        },
        {
          section: "Resources",
          items: filterItems([
            {
              label: "Books",
              href: routePermissions.userReadings,
              icon: BookMarked,
              permission: { route: routePermissions.userReadings, action: "read" },
            },
          ]),
        },
        ...profileSettingsItems,
        ...settingsItem,
      ];

    default:
      return [...profileSettingsItems, ...settingsItem];
  }
};
