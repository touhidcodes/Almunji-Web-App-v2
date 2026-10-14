import type { ElementType } from "react";

export interface TAdminBook {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TBook {
  id: number | string;
  title: string;
  author: string;
  description: string;
  category: string;
  language: string;
  pages: number;
  rating: number;
  downloads: number;
  coverImage: string;
  isPremium: boolean;
}

export interface TLibraryBook {
  id: number;
  title: string;
  author: string;
  category: string;
  format: string;
  pages: number;
  downloads: number;
  rating: number;
  reviews: number;
  language: string;
  publishYear: string;
  description: string;
  cover: string;
  badge: string;
  badgeColor: string;
  fileSize: string;
  difficulty: string;
  readTime: string;
}

export interface TBookCategory {
  name: string;
  count: number;
  icon: ElementType;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  progress: number;
  totalPages: number;
  currentPage: number;
  totalChapters?: number;
  currentChapter?: number;
  lastRead: string;
  lastReadDate: Date;
  cover: string;
  rating?: number;
  readingTime: string;
  isCompleted: boolean;
  tags: string[];
  description: string;
}

export type ViewMode = "grid" | "list";
export type CategoryFilter =
  | "all"
  | "hadith"
  | "tafsir"
  | "seerah"
  | "fiqh"
  | "aqidah"
  | "other";
