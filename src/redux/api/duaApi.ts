import { TDuaData, TDuaQueryParams, TUpdateDuaArgs } from "@/types/dua";
import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const duaApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Dua
    createDua: build.mutation({
      query: (data: TDuaData) => ({
        url: "/dua",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.dua],
    }),

    // Get all Dua for users
    getAllDuas: build.query({
      query: (params: TDuaQueryParams = {}) => ({
        url: "/dua/all",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.dua],
    }),

    // Get all Dua for admin
    getAllDuasAdmin: build.query({
      query: (params: TDuaQueryParams = {}) => ({
        url: "/dua/admin/all",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.dua],
    }),

    // Get single Dua
    getSingleDua: build.query({
      query: (id: string) => ({
        url: `/dua/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.dua],
    }),

    // Update Dua
    updateDua: build.mutation({
      query: ({ id, data }: TUpdateDuaArgs) => ({
        url: `/dua/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.dua],
    }),

    // Soft delete Dua
    softDeleteDua: build.mutation({
      query: (id: string) => ({
        url: `/dua/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dua],
    }),

    // Hard delete Dua
    hardDeleteDua: build.mutation({
      query: (id: string) => ({
        url: `/dua/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dua],
    }),
  }),
});

export const {
  useCreateDuaMutation,
  useGetAllDuasQuery,
  useGetAllDuasAdminQuery,
  useGetSingleDuaQuery,
  useUpdateDuaMutation,
  useSoftDeleteDuaMutation,
  useHardDeleteDuaMutation,
} = duaApi;