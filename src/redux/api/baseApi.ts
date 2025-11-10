import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tags";

// const baseUrl = `http://localhost:5000/api`;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
console.log(baseUrl);

const quranApiUrl = process.env.NEXT_PUBLIC_QURAN_API_URL!;

// Define a service using a base URL and expected endpoints
export const baseServerApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});

// API Service 2 - Second Base URL
export const baseQuranApi = createApi({
  reducerPath: "quranApi",
  baseQuery: axiosBaseQuery({
    baseUrl: quranApiUrl,
  }),
  endpoints: () => ({}),

  tagTypes: tagTypesList,
});
