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
