import type {
  TBook,
  TBookContent,
  TBookQueryParams,
  TBookContentQueryParams,
  TCreateBookPayload,
  TUpdateBookPayload,
  TCreateBookContentPayload,
  TUpdateBookContentPayload,
} from "@/types/book";

import type { TApiResponse, TPaginatedResponse } from "@/types/api";

import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const bookApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // ============================================
    // Book Endpoints
    // ============================================

    createBook: build.mutation<TApiResponse<TBook>, TCreateBookPayload>({
      query: (data) => ({
        url: "/book",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.book],
    }),

    getAllBooks: build.query<
      TPaginatedResponse<TBook>,
      TBookQueryParams | void
    >({
      query: (arg) => ({
        url: "/book/all",
        method: "GET",
        params: arg ?? {},
      }),
      providesTags: [tagTypes.book],
    }),

    getAllBooksAdmin: build.query<
      TPaginatedResponse<TBook>,
      TBookQueryParams | void
    >({
      query: (arg) => ({
        url: "/book/admin/all",
        method: "GET",
        params: arg ?? {},
      }),
      providesTags: [tagTypes.book],
    }),

    getSingleBook: build.query<TApiResponse<TBook>, string>({
      query: (id) => ({
        url: `/book/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),

    getBookBySlug: build.query<TApiResponse<TBook>, string>({
      query: (slug) => ({
        url: `/book/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),

    getBooksByCategory: build.query<TApiResponse<TBook[]>, string>({
      query: (categoryId) => ({
        url: `/book/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),

    updateBook: build.mutation<
      TApiResponse<TBook>,
      { id: string; data: TUpdateBookPayload }
    >({
      query: ({ id, data }) => ({
        url: `/book/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.book],
    }),

    softDeleteBook: build.mutation<TApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.book],
    }),

    hardDeleteBook: build.mutation<TApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/book/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.book],
    }),

    // ============================================
    // Book Content Endpoints
    // ============================================

    createBookContent: build.mutation<
      TApiResponse<TBookContent>,
      TCreateBookContentPayload
    >({
      query: (data) => ({
        url: "/book/content",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.bookContent, tagTypes.book],
    }),

    getAllBookContentsAdmin: build.query<
      TPaginatedResponse<TBookContent>,
      TBookContentQueryParams | void
    >({
      query: (arg) => ({
        url: "/book/content/admin/all",
        method: "GET",
        params: arg ?? {},
      }),
      providesTags: [tagTypes.bookContent],
    }),

    getSingleBookContent: build.query<TApiResponse<TBookContent>, string>({
      query: (id) => ({
        url: `/book/content/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),

    getContentsByBook: build.query<TApiResponse<TBookContent[]>, string>({
      query: (bookId) => ({
        url: `/book/content/book/${bookId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),

    getBookIndex: build.query<TApiResponse<TBookContent[]>, string>({
      query: (bookId) => ({
        url: `/book/content/index/${bookId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),

    updateBookContent: build.mutation<
      TApiResponse<TBookContent>,
      { id: string; data: TUpdateBookContentPayload }
    >({
      query: ({ id, data }) => ({
        url: `/book/content/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.bookContent, tagTypes.book],
    }),

    softDeleteBookContent: build.mutation<TApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/book/content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookContent, tagTypes.book],
    }),

    hardDeleteBookContent: build.mutation<TApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/book/content/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookContent, tagTypes.book],
    }),
  }),
});

export const {
  useCreateBookMutation,
  useGetAllBooksQuery,
  useGetAllBooksAdminQuery,
  useGetSingleBookQuery,
  useGetBookBySlugQuery,
  useGetBooksByCategoryQuery,
  useUpdateBookMutation,
  useSoftDeleteBookMutation,
  useHardDeleteBookMutation,

  useCreateBookContentMutation,
  useGetAllBookContentsAdminQuery,
  useGetSingleBookContentQuery,
  useGetContentsByBookQuery,
  useGetBookIndexQuery,
  useUpdateBookContentMutation,
  useSoftDeleteBookContentMutation,
  useHardDeleteBookContentMutation,
} = bookApi;
