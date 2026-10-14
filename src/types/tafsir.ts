export type TTafsir = {
  id: string;
  ayahId: string;
  heading?: string | null;
  summaryBn?: string | null;
  summaryEn?: string | null;
  detailBn?: string | null;
  detailEn?: string | null;
  scholar?: string | null;
  reference?: string | null;
  tags?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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
  tags?: string;
};

export type TUpdateTafsirPayload = {
  heading?: string;
  summaryBn?: string;
  summaryEn?: string;
  detailBn?: string;
  detailEn?: string;
  scholar?: string;
  reference?: string;
  tags?: string;
};
