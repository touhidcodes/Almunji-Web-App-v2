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
  slug: string;
  thumbnail?: string;
  summary?: string;
  content: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface TUpdateBlog {
  title?: string;
  slug?: string;
  thumbnail?: string | null;
  summary?: string | null;
  content?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isDeleted?: boolean;
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
