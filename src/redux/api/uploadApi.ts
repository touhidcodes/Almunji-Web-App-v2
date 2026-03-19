import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const uploadApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    uploadDictionaryBulk: build.mutation({
      query: (data) => ({
        url: "/upload/dictionary",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.dictionary],
    }),
  }),
});

export const { useUploadDictionaryBulkMutation } = uploadApi;
