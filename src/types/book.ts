export interface TBook {
  id: number;
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
