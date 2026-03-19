import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const blogApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createBlog: build.mutation({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.blog],
    }),
    getAllBlogs: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/blog/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.blog],
    }),
    getAllBlogsAdmin: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/blog/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.blog],
    }),
    getSingleBlog: build.query({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog],
    }),
    getBlogBySlug: build.query({
      query: (slug) => ({
        url: `/blog/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog],
    }),
    updateBlog: build.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.blog],
    }),
    softDeleteBlog: build.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog],
    }),
    hardDeleteBlog: build.mutation({
      query: (id) => ({
        url: `/blog/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetAllBlogsAdminQuery,
  useGetSingleBlogQuery,
  useGetBlogBySlugQuery,
  useUpdateBlogMutation,
  useSoftDeleteBlogMutation,
  useHardDeleteBlogMutation,
} = blogApi;
