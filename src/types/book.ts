export interface TBook {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover: string;
  categoryId: string;
  category?: TBookCategory;
  isFeatured: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  contents?: TBookContent[];
}

export interface TBookContent {
  id: string;
  bookId: string;
  section: string;
  index: number;
  text: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TBookCategory {
  id: string;
  name: string;
  isDeleted: boolean;
}

export interface TCreateBookPayload {
  name: string;
  slug: string;
  description?: string | null;
  cover: string;
  categoryId: string;
  isFeatured?: boolean;
}

export interface TUpdateBookPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  cover?: string;
  categoryId?: string;
  isFeatured?: boolean;
  isDeleted?: boolean;
}

export interface TCreateBookContentPayload {
  bookId: string;
  section: string;
  index: number;
  text: string;
}

export interface TUpdateBookContentPayload {
  section?: string;
  index?: number;
  text?: string;
  isDeleted?: boolean;
}

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
