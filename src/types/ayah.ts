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
