import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const bookmarkApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createBookmark: build.mutation({
      query: (data) => ({
        url: "/bookmark",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.bookmark],
    }),
    getMyBookmarks: build.query({
      query: () => ({
        url: "/bookmark/me",
        method: "GET",
      }),
      providesTags: [tagTypes.bookmark],
    }),
    getSingleBookmark: build.query({
      query: (id) => ({
        url: `/bookmark/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.bookmark],
    }),
    deleteBookmark: build.mutation({
      query: (id) => ({
        url: `/bookmark/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookmark],
    }),
    getAllBookmarksAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/bookmark",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.bookmark],
    }),
    hardDeleteBookmark: build.mutation({
      query: (id) => ({
        url: `/bookmark/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookmark],
    }),
  }),
});

export const {
  useCreateBookmarkMutation,
  useGetMyBookmarksQuery,
  useGetSingleBookmarkQuery,
  useDeleteBookmarkMutation,
  useGetAllBookmarksAdminQuery,
  useHardDeleteBookmarkMutation,
} = bookmarkApi;
