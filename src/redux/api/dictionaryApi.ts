import {
  TCreateDictionaryWord,
  TDictionary,
  TDictionaryAdminParams,
  TDictionarySuggestionParams,
  TUpdateDictionaryPayload,
} from "@/types/dictionary";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";
import { TApiResponse } from "@/types/api";

export const dictionaryApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createWord: build.mutation<
      TApiResponse<TDictionary>,
      TCreateDictionaryWord
    >({
      query: (data) => ({
        url: "/dictionary/word",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),

    getDictionarySuggestions: build.query<
      TApiResponse<TDictionary[]>,
      TDictionarySuggestionParams
    >({
      query: (arg) => ({
        url: "/dictionary/suggestion",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dictionary],
    }),

    getAllWordsAdmin: build.query<
      TApiResponse<TDictionary[]>,
      TDictionaryAdminParams
    >({
      query: (arg) => ({
        url: "/dictionary/admin/words",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dictionary],
    }),

    getDictionaryWord: build.query<TApiResponse<TDictionary>, string>({
      query: (id) => ({
        url: `/dictionary/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.dictionary],
    }),

    updateWord: build.mutation<
      TApiResponse<TDictionary>,
      TUpdateDictionaryPayload
    >({
      query: ({ id, data }) => ({
        url: `/dictionary/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),

    softDeleteWord: build.mutation<TApiResponse<null>, string>({
      query: (id) => ({
        url: `/dictionary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),

    hardDeleteWord: build.mutation<TApiResponse<null>, string>({
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
