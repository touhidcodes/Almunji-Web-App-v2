import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tags";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";

// const baseUrl = `http://localhost:5000/api`;
const baseUrl = process.env.BASE_URL!;
console.log(baseUrl);

const quranApiUrl = process.env.QURAN_API_URL!;

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
