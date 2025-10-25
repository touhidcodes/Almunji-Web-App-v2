import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const userApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: () => ({
        url: "/all-users",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getSingleUser: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getUserWithProfile: build.query({
      query: () => ({
        url: "/user-profile",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    UpdateUserProfile: build.mutation({
      query: (userData) => ({
        url: "/profile",
        method: "PUT",
        data: userData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    UpdateUserStatus: build.mutation({
      query: ({ userId, updatedData }) => ({
        url: `/status/${userId}`,
        method: "PUT",
        data: updatedData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    changePassword: build.mutation({
      query: (passwordData) => ({
        url: `/change-password`,
        method: "POST",
        data: passwordData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useGetUserWithProfileQuery,
  useGetAllUserQuery,
  useUpdateUserProfileMutation,
  useUpdateUserStatusMutation,
  useChangePasswordMutation,
} = userApi;
