export type TAyah = {
  id: string;
  surahId: string;
  paraId: string;
  number: number;
  arabic: string;
  transliteration?: string | null;
  bangla?: string | null;
  english?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TCreateAyahPayload = {
  surahId: string;
  paraId: string;
  number: number;
  arabic: string;
  transliteration?: string;
  bangla?: string;
  english?: string;
};

export type TUpdateAyahPayload = Partial<TCreateAyahPayload> & {
  isDeleted?: boolean;
};

type RelatedSurah = {
  id?: string;
  chapter?: number;
  arabic?: string;
  english?: string;
  bangla?: string;
};

type RelatedPara = {
  id?: string;
  number?: number;
  arabic?: string;
  english?: string;
  bangla?: string;
};

export type TCreatedAyahResponse = {
  id?: string;
  data?: {
    id?: string;
  };
};

export type TAyahWithRelations = TAyah & {
  surah?: RelatedSurah | null;
  para?: RelatedPara | null;
};

export type TAyahListQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  surahId?: string;
  paraId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TAyahsWithTafsirQueryParams = {
  page?: number;
  limit?: number;
  surahId?: string;
  paraId?: string;
  surahChapter?: number;
  paraNumber?: number;
  searchTerm?: string;
  number?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
