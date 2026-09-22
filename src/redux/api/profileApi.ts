import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tags";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  }),
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: [tagTypesList.user],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypesList.user],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
