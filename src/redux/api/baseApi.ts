import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tags";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const localUrl = process.env.NEXT_PUBLIC_LOCAL_URL!;
const quranApiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL!;

export const baseServerApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    localUrl,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

export const baseQuranApi = createApi({
  reducerPath: "quranApi",
  baseQuery: axiosBaseQuery({
    baseUrl: quranApiUrl,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});