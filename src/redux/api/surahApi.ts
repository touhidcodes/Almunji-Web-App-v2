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
    getAllSurah: build.query<
      TApiResponse<TSurah[]>,
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: "/surah/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.surah],
    }),

    // Get all surahs (admin view)
    getAllSurahAdmin: build.query<
      TApiResponse<TSurah[]>,
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: "/surah/admin/all",
        method: "GET",
        params: arg,
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
        data: payload,
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
        data: payload,
      }),
      invalidatesTags: (_result, _error, { surahId }) => [
        { type: tagTypes.surah, id: surahId },
      ],
    }),

    // Hard delete surah
    hardDeleteSurah: build.mutation<TApiResponse<null>, string>({
      query: (surahId) => ({
        url: `/surah/admin/${surahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.surah],
    }),
  }),
});

export const {
  useGetAllSurahQuery,
  useGetAllSurahAdminQuery,
  useGetSingleSurahQuery,
  useCreateSurahMutation,
  useUpdateSurahMutation,
  useHardDeleteSurahMutation,
} = surahApi;
