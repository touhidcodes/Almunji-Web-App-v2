export type TDuaQueryParams = {
  searchTerm?: string;
  tags?: string;
  isDeleted?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export interface TDuaData {
  id?: string;
  name: string;
  arabic: string;
  transliteration?: string;
  bangla: string;
  english?: string;
  reference?: string;
  tags?: string[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TUpdateDuaArgs = {
  id: string;
  data: Partial<TDuaData>;
};

export type TUpdateDuaPayload = Partial<
  Pick<
    TDuaData,
    | "name"
    | "arabic"
    | "transliteration"
    | "bangla"
    | "english"
    | "reference"
    | "tags"
    | "isDeleted"
  >
>;
