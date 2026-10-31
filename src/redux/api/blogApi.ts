import type {
  TBlogDeleteResponse,
  TBlogQueryParams,
  TBlogResponse,
  TBlogsResponse,
  TCreateBlog,
  TUpdateBlogRequest,
} from "@/types/blog";

import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const blogApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Blog
    createBlog: build.mutation<TBlogResponse, TCreateBlog>({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.blog],
    }),

    // Get All Published Blogs
    getAllBlogs: build.query<TBlogsResponse, TBlogQueryParams | void>({
      query: (arg) => ({
        url: "/blog/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.blog],
    }),

    // Get All Blogs (Admin)
    getAllBlogsAdmin: build.query<TBlogsResponse, TBlogQueryParams | void>({
      query: (arg) => ({
        url: "/blog/admin/all",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.blog],
    }),

    // Get Single Blog by ID
    getSingleBlog: build.query<TBlogResponse, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog],
    }),

    // Get Blog by Slug
    getBlogBySlug: build.query<TBlogResponse, string>({
      query: (slug) => ({
        url: `/blog/slug/${slug}`,
        method: "GET",
      }),
      providesTags: [tagTypes.blog],
    }),

    // Update Blog
    updateBlog: build.mutation<TBlogResponse, TUpdateBlogRequest>({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.blog],
    }),

    // Soft Delete Blog
    softDeleteBlog: build.mutation<TBlogDeleteResponse, string>({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.blog],
    }),

    // Hard Delete Blog
    hardDeleteBlog: build.mutation<TBlogDeleteResponse, string>({
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
