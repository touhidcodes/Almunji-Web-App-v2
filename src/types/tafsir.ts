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
