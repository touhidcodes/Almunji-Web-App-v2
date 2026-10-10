export type TDuaQueryParams = {
  searchTerm?: string;
  tags?: string;
  isDeleted?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TDuaData = {
  name: string;
  arabic: string;
  transliteration?: string;
  bangla: string;
  english?: string;
  reference?: string;
  tags?: string[];
};

export type TUpdateDuaArgs = {
  id: string;
  data: Partial<TDuaData>;
};

export type TDua = {
  id: string;
  name: string;
  arabic: string;
  transliteration?: string;
  bangla: string;
  english?: string;
  reference?: string;
  tags?: string[];
};

export type TUpdateDuaPayload = {
  name: string;
  arabic: string;
  transliteration?: string;
  bangla: string;
  english?: string;
  reference?: string;
  tags?: string[];
};
