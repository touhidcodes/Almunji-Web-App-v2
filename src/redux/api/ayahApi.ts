import { TApiResponse } from "@/types/api";
import { TAyah, TCreateAyahPayload, TUpdateAyahPayload } from "@/types/ayah";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const ayahApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all ayahs
    getAllAyahs: build.query<TApiResponse<TAyah[]>, void>({
      query: () => ({
        url: "/ayah",
        method: "GET",
      }),
      providesTags: [tagTypes.ayah],
    }),

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
    // Create ayah
    createAyah: build.mutation<TApiResponse<TAyah>, TCreateAyahPayload>({
      query: (payload) => ({
        url: "/ayah",
        method: "POST",
        body: payload,
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
        body: payload,
      }),
      invalidatesTags: (_r, _e, { ayahId }) => [
        { type: tagTypes.ayah, id: ayahId },
      ],
    }),

    // Soft delete ayah
    deleteAyah: build.mutation<TApiResponse<null>, string>({
      query: (ayahId) => ({
        url: `/ayah/${ayahId}`,
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
  useCreateAyahMutation,
  useUpdateAyahMutation,
  useDeleteAyahMutation,
} = ayahApi;
