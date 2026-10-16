import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export type TUserProfile = {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  profession: string | null;
  address: string | null;
};

export type TProfileUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile: TUserProfile | null;
};

export type TUpdateProfilePayload = {
  name: string;
  image: string;
  bio: string;
  profession: string;
  address: string;
};

type TApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const userApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    getProfile: build.query<TApiResponse<TProfileUser>, void>({
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

    updateProfile: build.mutation<
      TApiResponse<TProfileUser>,
      TUpdateProfilePayload
    >({
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

    updateUserRole: build.mutation<
      unknown,
      { id: string; data: { role: string } }
    >({
      query: ({ id, data }) => ({
        url: `/user/role/${id}`,
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
  useUpdateUserRoleMutation,
} = userApi;
