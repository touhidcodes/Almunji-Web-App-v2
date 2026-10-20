import { TApiResponse } from "@/types/api";
import {
  TAyah,
  TAyahListQueryParams,
  TAyahsWithTafsirQueryParams,
  TCreateAyahPayload,
  TUpdateAyahPayload,
} from "@/types/ayah";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const ayahApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all Ayahs with filtering and pagination
    getAllAyahs: build.query<
      TApiResponse<TAyah[]>,
      TAyahListQueryParams | void
    >({
      query: (params) => ({
        url: "/ayah/all",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ayah],
    }),

    // Get Ayahs with Tafsir, filtering, sorting, and pagination
    getAyahsWithTafsir: build.query<
      TApiResponse<TAyah[]>,
      TAyahsWithTafsirQueryParams | void
    >({
      query: (params) => ({
        url: "/ayah",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),

    // Get a single Ayah by ID
    getAyahById: build.query<TApiResponse<TAyah>, string>({
      query: (ayahId) => ({
        url: `/ayah/${ayahId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, ayahId) => [
        tagTypes.ayah,
        { type: tagTypes.ayah, id: ayahId },
      ],
    }),

    // Get Ayahs by Surah ID
    getAyahsBySurah: build.query<TApiResponse<TAyah[]>, string>({
      query: (surahId) => ({
        url: `/ayah/surah/${surahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah],
    }),

    // Get Ayahs by Para ID
    getAyahsByPara: build.query<TApiResponse<TAyah[]>, string>({
      query: (paraId) => ({
        url: `/ayah/para/${paraId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah],
    }),

    // Get Ayahs and their Tafsir by Surah ID
    getAyahsAndTafsirBySurah: build.query<TApiResponse<TAyah[]>, string>({
      query: (surahId) => ({
        url: `/ayah/tafsir/${surahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),

    // Create an Ayah
    createAyah: build.mutation<TApiResponse<TAyah>, TCreateAyahPayload>({
      query: (payload) => ({
        url: "/ayah",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),

    // Update an Ayah
    updateAyah: build.mutation<
      TApiResponse<TAyah>,
      {
        ayahId: string;
        payload: TUpdateAyahPayload;
      }
    >({
      query: ({ ayahId, payload }) => ({
        url: `/ayah/${ayahId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { ayahId }) => [
        tagTypes.ayah,
        tagTypes.tafsir,
        { type: tagTypes.ayah, id: ayahId },
      ],
    }),

    // Soft-delete an Ayah
    softDeleteAyah: build.mutation<TApiResponse<null>, string>({
      query: (ayahId) => ({
        url: `/ayah/${ayahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),

    // Permanently delete an Ayah (Admin/Superadmin)
    hardDeleteAyah: build.mutation<TApiResponse<null>, string>({
      query: (ayahId) => ({
        url: `/ayah/admin/${ayahId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ayah, tagTypes.tafsir],
    }),
  }),
});

export const {
  useGetAllAyahsQuery,
  useGetAyahsWithTafsirQuery,
  useGetAyahByIdQuery,
  useGetAyahsBySurahQuery,
  useGetAyahsByParaQuery,
  useGetAyahsAndTafsirBySurahQuery,
  useCreateAyahMutation,
  useUpdateAyahMutation,
  useSoftDeleteAyahMutation,
  useHardDeleteAyahMutation,
} = ayahApi;
