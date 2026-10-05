import {
  TCreateTafsirPayload,
  TTafsirQueryParams,
  TUpdateTafsirPayload,
} from "@/types/tafsir";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const tafsirApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // -----------------------------------------------------------------------
    // Create Tafsir
    // POST /tafsir
    // -----------------------------------------------------------------------

    createTafsir: build.mutation({
      query: (data: TCreateTafsirPayload) => ({
        url: "/tafsir",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Get All Tafsir - Admin
    // GET /tafsir/admin/all
    // -----------------------------------------------------------------------

    getAllTafsirAdmin: build.query({
      query: (params?: TTafsirQueryParams) => ({
        url: "/tafsir/admin/all",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Get Tafsir By Ayah
    // GET /tafsir/ayah/:ayahId
    // -----------------------------------------------------------------------

    getTafsirByAyah: build.query({
      query: (ayahId: string) => ({
        url: `/tafsir/ayah/${ayahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Get Single Tafsir
    // GET /tafsir/:tafsirId
    // -----------------------------------------------------------------------

    getSingleTafsir: build.query({
      query: (tafsirId: string) => ({
        url: `/tafsir/${tafsirId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Update Tafsir
    // PUT /tafsir/:tafsirId
    // -----------------------------------------------------------------------

    updateTafsir: build.mutation({
      query: ({ id, data }: { id: string; data: TUpdateTafsirPayload }) => ({
        url: `/tafsir/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Soft Delete Tafsir
    // DELETE /tafsir/:tafsirId
    // -----------------------------------------------------------------------

    softDeleteTafsir: build.mutation({
      query: (tafsirId: string) => ({
        url: `/tafsir/${tafsirId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),

    // -----------------------------------------------------------------------
    // Hard Delete Tafsir
    // DELETE /tafsir/admin/:tafsirId
    // -----------------------------------------------------------------------

    hardDeleteTafsir: build.mutation({
      query: (tafsirId: string) => ({
        url: `/tafsir/admin/${tafsirId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                   Hooks                                    */
/* -------------------------------------------------------------------------- */

export const {
  useCreateTafsirMutation,
  useGetAllTafsirAdminQuery,
  useGetTafsirByAyahQuery,
  useGetSingleTafsirQuery,
  useUpdateTafsirMutation,
  useSoftDeleteTafsirMutation,
  useHardDeleteTafsirMutation,
} = tafsirApi;
