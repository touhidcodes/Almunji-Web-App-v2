export type TDuaQueryParams = {
  searchTerm?: string;
  tags?: string;
  isDeleted?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// Prisma Json? field representation
export type TDuaTags = string[] | null;

export interface TDua {
  id: string;
  name: string;
  arabic: string;
  transliteration: string | null;
  bangla: string;
  english: string | null;
  reference: string | null;
  tags: TDuaTags;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TCreateDuaPayload = {
  name: string;
  arabic: string;
  transliteration?: string | null;
  bangla: string;
  english?: string | null;
  reference?: string | null;
  tags?: string[] | null;
};

export type TUpdateDuaPayload = Partial<TCreateDuaPayload> & {
  isDeleted?: boolean;
};

export type TUpdateDuaArgs = {
  id: string;
  data: TUpdateDuaPayload;
};

export interface TDuaListResponse {
  success: boolean;
  message?: string;
  data: TDua[];
}

export interface TDuaSingleResponse {
  success: boolean;
  message?: string;
  data: TDua;
}

export interface TDuaMutationResponse {
  success: boolean;
  message?: string;
  data?: TDua;
}
