import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const paraApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPara: build.query({
      query: () => ({
        url: "/para",
        method: "GET",
      }),
      providesTags: [tagTypes.para],
    }),

    getSinglePara: build.query({
      query: (paraId) => ({
        url: `/para/${paraId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.para],
    }),
  }),
});

export const { useGetAllParaQuery, useGetSingleParaQuery } = paraApi;
