import { TApiResponse } from "@/types/api";
import {
  TCreateSurahPayload,
  TSurah,
  TUpdateSurahPayload,
} from "@/types/surah";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const surahApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all surahs
    getAllSurah: build.query<TApiResponse<TSurah[]>, void>({
      query: () => ({
        url: "/surah",
        method: "GET",
      }),
      providesTags: [tagTypes.surah],
    }),

    // Get single surah by ID
    getSingleSurah: build.query<TApiResponse<TSurah>, string>({
      query: (surahId) => ({
        url: `/surah/${surahId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, surahId) => [
        { type: tagTypes.surah, id: surahId },
      ],
    }),
    // Create surah
    createSurah: build.mutation<TApiResponse<TSurah>, TCreateSurahPayload>({
      query: (payload) => ({
        url: "/surah",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.surah],
    }),

    // Update surah
    updateSurah: build.mutation<
      TApiResponse<TSurah>,
      { surahId: string; payload: TUpdateSurahPayload }
    >({
      query: ({ surahId, payload }) => ({
        url: `/surah/${surahId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { surahId }) => [
        { type: tagTypes.surah, id: surahId },
      ],
    }),

    // Delete surah
    deleteSurah: build.mutation<TApiResponse<null>, string>({
      query: (surahId) => ({
        url: `/surah/${surahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.surah],
    }),
  }),
});

export const {
  useGetAllSurahQuery,
  useGetSingleSurahQuery,
  useCreateSurahMutation,
  useUpdateSurahMutation,
  useDeleteSurahMutation,
} = surahApi;
