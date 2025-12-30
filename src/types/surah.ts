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
