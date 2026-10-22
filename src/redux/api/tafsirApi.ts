import {
  TCreateTafsirPayload,
  TTafsirQueryParams,
  TUpdateTafsirPayload,
} from "@/types/tafsir";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const tafsirApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Tafsir
    createTafsir: build.mutation({
      query: (data: TCreateTafsirPayload) => ({
        url: "/tafsir",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // Get All Tafsir - Admin
    getAllTafsirAdmin: build.query({
      query: (params?: TTafsirQueryParams) => ({
        url: "/tafsir/admin/all",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // Get Tafsir By Ayah
    getTafsirByAyah: build.query({
      query: (ayahId: string) => ({
        url: `/tafsir/ayah/${ayahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // Get Single Tafsir
    getSingleTafsir: build.query({
      query: (tafsirId: string) => ({
        url: `/tafsir/${tafsirId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // Update Tafsir
    updateTafsir: build.mutation({
      query: ({ id, data }: { id: string; data: TUpdateTafsirPayload }) => ({
        url: `/tafsir/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // Soft Delete Tafsir
    softDeleteTafsir: build.mutation({
      query: (tafsirId: string) => ({
        url: `/tafsir/${tafsirId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // Hard Delete Tafsir
    hardDeleteTafsir: build.mutation({
      query: (tafsirId: string) => ({
        url: `/tafsir/admin/${tafsirId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),
  }),
});

export const {
  useCreateTafsirMutation,
  useGetAllTafsirAdminQuery,
  useGetTafsirByAyahQuery,
  useGetSingleTafsirQuery,
  useUpdateTafsirMutation,
  useSoftDeleteTafsirMutation,
  useHardDeleteTafsirMutation,
} = tafsirApi;
