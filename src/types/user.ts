export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface TUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile | null;
  permissions?: UserPermission[];
  Bookmark?: Bookmark[];
}

export interface UserProfile {
  id: string;
  userId: string;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  profession?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resource: Resource;
  action: Action;
  createdAt: Date;
  users?: UserPermission[];
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  assignedBy?: string | null;
  assignedAt: Date;
  user?: TUser;
  permission?: Permission;
}

export enum Resource {
  SURAH = "SURAH",
  PARA = "PARA",
  AYAH = "AYAH",
  TAFSIR = "TAFSIR",
  DICTIONARY = "DICTIONARY",
  BOOK = "BOOK",
  BOOKCATEGORY = "BOOKCATEGORY",
  BOOKCONTENT = "BOOKCONTENT",
  BLOG = "BLOG",
  DUA = "DUA",
  USER = "USER",
  PERMISSION = "PERMISSION",
  BOOKMARK = "BOOKMARK",
}

export enum Action {
  READ = "READ",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum BookmarkType {
  DUA = "DUA",
  AYAH = "AYAH",
}

export interface Bookmark {
  id: string;
  userId: string;
  itemId: string;
  itemType: BookmarkType;
  createdAt: Date;
}
