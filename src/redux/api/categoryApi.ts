import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const categoryApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createCategory: build.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    getAllCategoriesAdmin: build.query({
      query: () => ({
        url: "/category/admin/all",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    updateCategory: build.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.category],
    }),
    softDeleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
    hardDeleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesAdminQuery,
  useUpdateCategoryMutation,
  useSoftDeleteCategoryMutation,
  useHardDeleteCategoryMutation,
} = categoryApi;
