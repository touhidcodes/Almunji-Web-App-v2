export interface TBlog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  summary: string | null;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TCreateBlog {
  title: string;
  thumbnail?: string;
  summary?: string;
  content: string;
}

export interface TUpdateBlog {
  title?: string;
  thumbnail?: string;
  summary?: string;
  content?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface TBlogQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isDeleted?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TBlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TBlogListResponse {
  blogs: TBlog[];
  meta: TBlogPagination;
}

export interface TApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type TBlogResponse = TApiResponse<TBlog>;

export type TBlogsResponse = TApiResponse<TBlogListResponse>;

export interface TBlogDeleteResponse {
  success: boolean;
  message: string;
}

export interface TUpdateBlogRequest {
  id: string;
  data: TUpdateBlog;
}
