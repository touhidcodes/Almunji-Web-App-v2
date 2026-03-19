import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const tafsirApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createTafsir: build.mutation({
      query: (data) => ({
        url: "/tafsir",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),
    getAllTafsirAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/tafsir/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.tafsir],
    }),
    getTafsirByAyah: build.query({
      query: (ayahId) => ({
        url: `/tafsir/ayah/${ayahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),
    getSingleTafsir: build.query({
      query: (id) => ({
        url: `/tafsir/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tafsir],
    }),
    updateTafsir: build.mutation({
      query: ({ id, data }) => ({
        url: `/tafsir/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),
    softDeleteTafsir: build.mutation({
      query: (id) => ({
        url: `/tafsir/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tafsir],
    }),
    hardDeleteTafsir: build.mutation({
      query: (id) => ({
        url: `/tafsir/admin/${id}`,
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
