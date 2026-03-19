import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const permissionApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createPermission: build.mutation({
      query: (data) => ({
        url: "/permission",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.permission],
    }),
    getAllPermissions: build.query({
      query: () => ({
        url: "/permission",
        method: "GET",
      }),
      providesTags: [tagTypes.permission],
    }),
    assignPermission: build.mutation({
      query: (data) => ({
        url: "/permission/assign",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.permission],
    }),
    getUserPermissions: build.query({
      query: (userId) => ({
        url: `/permission/user/${userId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.permission],
    }),
    removePermission: build.mutation({
      query: (data) => ({
        url: "/permission/remove",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.permission],
    }),
    deletePermission: build.mutation({
      query: (id) => ({
        url: `/permission/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.permission],
    }),
  }),
});

export const {
  useCreatePermissionMutation,
  useGetAllPermissionsQuery,
  useAssignPermissionMutation,
  useGetUserPermissionsQuery,
  useRemovePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
