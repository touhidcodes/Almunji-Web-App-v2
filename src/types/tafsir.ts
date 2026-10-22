import { TAyah } from "./ayah";

export type TTafsir = {
  id: string;
  heading?: string | null;
  summaryBn?: string | null;
  summaryEn?: string | null;
  detailBn?: string | null;
  detailEn?: string | null;
  scholar?: string | null;
  reference?: string | null;
  tags?: string[] | string | null;
  isDeleted?: boolean;
};

export type TTafsirQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  ayahId?: string;
  scholar?: string;
};

export type TCreateTafsirPayload = {
  ayahId: string;
  heading?: string;
  summaryBn?: string;
  summaryEn?: string;
  detailBn?: string;
  detailEn?: string;
  scholar?: string;
  reference?: string;
  tags?: string[];
};

export type TUpdateTafsirPayload = {
  heading?: string;
  summaryBn?: string;
  summaryEn?: string;
  detailBn?: string;
  detailEn?: string;
  scholar?: string;
  reference?: string;
  tags?: string[];
};

export type TAyahWithTafsir = TAyah & {
  surah?: {
    id: string;
    chapter: number;
    arabic: string;
    english: string;
    bangla: string;
  } | null;
  para?: {
    id: string;
    number: number;
    arabic: string;
    english: string;
    bangla: string;
  } | null;
  tafsir?: TTafsir | null;
};

export type TPageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TTafsirFormValues = {
  heading: string;
  summaryBn: string;
  summaryEn: string;
  detailBn: string;
  detailEn: string;
  scholar: string;
  reference: string;
  tags: string;
};
