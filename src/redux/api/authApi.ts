import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const authApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        data: userData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    login: build.mutation({
      query: (loginData) => ({
        url: "/login",
        method: "POST",
        data: loginData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    refreshToken: build.mutation({
      query: (data) => ({
        url: "/refresh-token",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user, tagTypes.auth],
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
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApi;
