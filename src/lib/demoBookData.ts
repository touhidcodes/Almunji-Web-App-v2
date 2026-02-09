import { TBook } from "@/types/book";

export const books: TBook[] = [
  {
    id: 1,
    title: "Tafsir Ibn Kathir",
    author: "Ibn Kathir",
    description:
      "A comprehensive commentary on the Quran, providing detailed explanations and interpretations of verses.",
    category: "tafsir",
    language: "english",
    pages: 3200,
    rating: 4.9,
    downloads: 15420,
    coverImage:
      "https://images.unsplash.com/photo-1544716278-e513176f20a5?w=300&h=400&fit=crop&crop=center",
    isPremium: false,
  },
  {
    id: 2,
    title: "Sahih Al-Bukhari",
    author: "Imam Al-Bukhari",
    description:
      "The most authentic collection of Hadith literature, essential for understanding Islamic teachings.",
    category: "hadith",
    language: "arabic",
    pages: 2400,
    rating: 5.0,
    downloads: 23150,
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center",
    isPremium: true,
  },
  {
    id: 3,
    title: "The Noble Quran Translation",
    author: "Muhammad Muhsin Khan",
    description:
      "Clear and accurate English translation of the Holy Quran with detailed footnotes.",
    category: "translation",
    language: "english",
    pages: 850,
    rating: 4.8,
    downloads: 45200,
    coverImage:
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=300&h=400&fit=crop&crop=center",
    isPremium: false,
  },
  {
    id: 4,
    title: "Fiqh As-Sunnah",
    author: "Sayyid Sabiq",
    description:
      "Comprehensive guide to Islamic jurisprudence based on Quran and Sunnah.",
    category: "fiqh",
    language: "english",
    pages: 1200,
    rating: 4.7,
    downloads: 8900,
    coverImage:
      "https://images.unsplash.com/photo-1585779034823-7e9ac8faec70?w=300&h=400&fit=crop&crop=center",
    isPremium: false,
  },
  {
    id: 5,
    title: "Riyad As-Salihin",
    author: "Imam An-Nawawi",
    description:
      "Gardens of the Righteous - a collection of authentic Hadiths on various aspects of Islamic life.",
    category: "hadith",
    language: "arabic",
    pages: 680,
    rating: 4.9,
    downloads: 12300,
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&crop=center",
    isPremium: false,
  },
  {
    id: 6,
    title: "Stories of the Prophets",
    author: "Ibn Kathir",
    description:
      "Detailed accounts of the lives and teachings of the Prophets mentioned in the Quran.",
    category: "biography",
    language: "english",
    pages: 920,
    rating: 4.6,
    downloads: 18700,
    coverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
    isPremium: true,
  },
];
