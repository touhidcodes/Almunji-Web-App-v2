export interface TBookContentCreatePayload {
  bookId: string;
  section: string;
  index: number;
  text: string;
}

export interface TBookContentUpdatePayload {
  section?: string;
  index?: number;
  text?: string;
  isDeleted?: boolean;
}

export interface TBookUpdatePayload {
  name?: string;
  description?: string;
  cover?: string;
  categoryId?: string;
  isFeatured?: boolean;
  isDeleted?: boolean;
}

export type TBookQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  categoryId?: string;
  isFeatured?: boolean;
};

export type TBookContentQueryParams = TBookQueryParams & {
  bookId?: string;
};
