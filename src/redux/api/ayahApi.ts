import { TApiResponse } from "@/types/api";
import { TAyah, TCreateAyahPayload, TUpdateAyahPayload } from "@/types/ayah";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const ayahApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all ayahs
    getAllAyahs: build.query<TApiResponse<TAyah[]>, void | Record<string, any>>(
      {
        query: (arg) => ({
          url: "/ayah/all",
          method: "GET",
          params: arg,
        }),
        providesTags: [tagTypes.ayah],
      },
    ),

    // Get ayah by ID
    getAyahById: build.query<TApiResponse<TAyah>, string>({
      query: (ayahId) => ({
        url: `/ayah/${ayahId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, ayahId) => [{ type: tagTypes.ayah, id: ayahId }],
    }),

    // Get ayahs by surah
    getAyahsBySurah: build.query<TApiResponse<TAyah[]>, string>({
      query: (surahId) => ({
        url: `/ayah/surah/${surahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah],
    }),

    // Get ayahs by para
    getAyahsByPara: build.query<TApiResponse<TAyah[]>, string>({
      query: (paraId) => ({
        url: `/ayah/para/${paraId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah],
    }),

    // Get ayahs and their tafsir by surah ID
    getAyahsAndTafsirBySurah: build.query<TApiResponse<TAyah[]>, string>({
      query: (surahId) => ({
        url: `/ayah/tafsir/${surahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),

    // Create ayah
    createAyah: build.mutation<TApiResponse<TAyah>, TCreateAyahPayload>({
      query: (payload) => ({
        url: "/ayah",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [tagTypes.ayah],
    }),

    // Update ayah
    updateAyah: build.mutation<
      TApiResponse<TAyah>,
      { ayahId: string; payload: TUpdateAyahPayload }
    >({
      query: ({ ayahId, payload }) => ({
        url: `/ayah/${ayahId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_r, _e, { ayahId }) => [
        { type: tagTypes.ayah, id: ayahId },
      ],
    }),

    // Soft delete ayah
    softDeleteAyah: build.mutation<TApiResponse<null>, string>({
      query: (ayahId) => ({
        url: `/ayah/${ayahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ayah],
    }),

    // Hard delete ayah
    hardDeleteAyah: build.mutation<TApiResponse<null>, string>({
      query: (ayahId) => ({
        url: `/ayah/admin/${ayahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ayah],
    }),
  }),
});

export const {
  useGetAllAyahsQuery,
  useGetAyahByIdQuery,
  useGetAyahsBySurahQuery,
  useGetAyahsByParaQuery,
  useGetAyahsAndTafsirBySurahQuery,
  useCreateAyahMutation,
  useUpdateAyahMutation,
  useSoftDeleteAyahMutation,
  useHardDeleteAyahMutation,
} = ayahApi;
