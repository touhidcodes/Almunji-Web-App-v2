import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const dictionaryApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createWord: build.mutation({
      query: (data) => ({
        url: "/dictionary/word",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),
    getDictionarySuggestions: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/dictionary/suggestion",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dictionary],
    }),
    getAllWordsAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/dictionary/admin/words",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dictionary],
    }),
    getDictionaryWord: build.query({
      query: (id) => ({
        url: `/dictionary/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.dictionary],
    }),
    updateWord: build.mutation({
      query: ({ id, data }) => ({
        url: `/dictionary/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),
    softDeleteWord: build.mutation({
      query: (id) => ({
        url: `/dictionary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),
    hardDeleteWord: build.mutation({
      query: (id) => ({
        url: `/dictionary/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),
  }),
});

export const {
  useCreateWordMutation,
  useGetDictionarySuggestionsQuery,
  useGetAllWordsAdminQuery,
  useGetDictionaryWordQuery,
  useUpdateWordMutation,
  useSoftDeleteWordMutation,
  useHardDeleteWordMutation,
} = dictionaryApi;
