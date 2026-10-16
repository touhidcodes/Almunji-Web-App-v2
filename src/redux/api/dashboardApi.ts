import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const dashboardApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get Dashboard Statistics
    getDashboardStats: build.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: [tagTypes.dashboard],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
