import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const duaApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createDua: build.mutation({
      query: (data) => ({
        url: "/dua",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.dua],
    }),
    getAllDuas: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/dua/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dua],
    }),
    getAllDuasAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/dua/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dua],
    }),
    getSingleDua: build.query({
      query: (id) => ({
        url: `/dua/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.dua],
    }),
    updateDua: build.mutation({
      query: ({ id, data }) => ({
        url: `/dua/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.dua],
    }),
    softDeleteDua: build.mutation({
      query: (id) => ({
        url: `/dua/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.dua],
    }),
    hardDeleteDua: build.mutation({
      query: (id) => ({
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
