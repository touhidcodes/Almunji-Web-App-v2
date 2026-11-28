import type {
  AssignBulkPermissionsPayload,
  AssignPermissionPayload,
  CreatePermissionPayload,
  PermissionsResponse,
  RemovePermissionPayload,
  UserPermissionsResponse,
} from "@/types/permission";

import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const permissionApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    createPermission: build.mutation<unknown, CreatePermissionPayload>({
      query: (data) => ({
        url: "/permission",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.permission],
    }),

    getAllPermissions: build.query<PermissionsResponse, void>({
      query: () => ({
        url: "/permission/all",
        method: "GET",
      }),
      providesTags: [tagTypes.permission],
    }),

    assignPermission: build.mutation<unknown, AssignPermissionPayload>({
      query: (data) => ({
        url: "/permission/assign",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.permission],
    }),

    assignBulkPermissions: build.mutation<
      unknown,
      AssignBulkPermissionsPayload
    >({
      query: (data) => ({
        url: "/permission/bulk-assign",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.permission],
    }),

    getUserPermissions: build.query<UserPermissionsResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}/permissions`,
        method: "GET",
      }),
      providesTags: [tagTypes.user, tagTypes.permission],
    }),

    removePermission: build.mutation<unknown, RemovePermissionPayload>({
      query: (data) => ({
        url: "/permission/remove",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.permission],
    }),

    deletePermission: build.mutation<unknown, string>({
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
  useAssignBulkPermissionsMutation,
  useGetUserPermissionsQuery,
  useRemovePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
