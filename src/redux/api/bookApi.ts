import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const bookApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Book Endpoints
    createBook: build.mutation({
      query: (data) => ({
        url: "/book",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.book],
    }),
    getAllBooks: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/book/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.book],
    }),
    getAllBooksAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/book/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.book],
    }),
    getSingleBook: build.query({
      query: (id) => ({
        url: `/book/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),
    getBookBySlug: build.query({
      query: (slug) => ({
        url: `/book/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),
    getBooksByCategory: build.query({
      query: (categoryId) => ({
        url: `/book/category/${categoryId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.book],
    }),
    updateBook: build.mutation({
      query: ({ id, data }) => ({
        url: `/book/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.book],
    }),
    softDeleteBook: build.mutation({
      query: (id) => ({
        url: `/book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.book],
    }),
    hardDeleteBook: build.mutation({
      query: (id) => ({
        url: `/book/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.book],
    }),

    // Book Content Endpoints
    createBookContent: build.mutation({
      query: (data) => ({
        url: "/book/content",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.bookContent],
    }),
    getAllBookContentsAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/book/content/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.bookContent],
    }),
    getSingleBookContent: build.query({
      query: (id) => ({
        url: `/book/content/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),
    getContentsByBook: build.query({
      query: (bookId) => ({
        url: `/book/content/book/${bookId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),
    getBookIndex: build.query({
      query: (bookId) => ({
        url: `/book/content/index/${bookId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookContent],
    }),
    updateBookContent: build.mutation({
      query: ({ id, data }) => ({
        url: `/book/content/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.bookContent],
    }),
    softDeleteBookContent: build.mutation({
      query: (id) => ({
        url: `/book/content/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookContent],
    }),
    hardDeleteBookContent: build.mutation({
      query: (id) => ({
        url: `/book/content/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookContent],
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
