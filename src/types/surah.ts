// Type definitions
export interface TChapterData {
  id: string | number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}

export interface TSurah {
  id: number;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  meaning: string;
  totalAyahs: number;
  revelation: "Meccan" | "Medinan";
  revelationOrder: number | null;
  mainThemes: string;
  description: string;
}

export interface TNewSurah {
  number: string;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  meaning: string;
  totalAyahs: string;
  revelation: "Meccan" | "Medinan";
  revelationOrder: string;
  mainThemes: string;
  description: string;
}
export interface TSurahData {
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
  surahNo: number;
  english: string[];
  arabic1: string[];
  arabic2: string[];
  bengali: string[];
}
