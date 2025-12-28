import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const surahApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSurah: build.query({
      query: () => ({
        url: "/surah",
        method: "GET",
      }),
      providesTags: [tagTypes.surah],
    }),

    getSingleSurah: build.query({
      query: (surahId) => ({
        url: `/surah/${surahId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.surah],
    }),
  }),
});

export const { useGetAllSurahQuery, useGetSingleSurahQuery } = surahApi;
