import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const userApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getProfile: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    getAllUsers: build.query({
      query: () => ({
        url: "/user/all",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateProfile: build.mutation({
      query: (userData) => ({
        url: "/user/profile",
        method: "PUT",
        data: userData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updateUserStatus: build.mutation({
      query: ({ userId, data }) => ({
        url: `/user/status/${userId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetProfileQuery,
  useGetAllUsersQuery,
  useUpdateProfileMutation,
  useUpdateUserStatusMutation,
} = userApi;
