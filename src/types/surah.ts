export type TSurah = {
  id: string;
  chapter: number;
  totalAyah: number;
  arabic: string;
  english: string;
  bangla?: string | null;
  history?: string | null;
  revelation: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateSurahPayload = {
  chapter: number;
  totalAyah: number;
  arabic: string;
  english: string;
  bangla?: string;
  history?: string;
  revelation: string;
};

export type TUpdateSurahPayload = Partial<TCreateSurahPayload>;

export interface TChapterData {
  id: number;
  surahName: string;
  surahNameArabic: string;
  surahNameArabicLong: string;
  surahNameTranslation: string;
  revelationPlace: string;
  totalAyah: number;
}
