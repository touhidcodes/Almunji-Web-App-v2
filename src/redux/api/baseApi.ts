import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tags";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";
const quranApiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || "https://quranapi.pages.dev/api";

export const baseServerApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl,
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