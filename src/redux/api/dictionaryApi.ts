import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

interface DictionarySuggestion {
  data: unknown[];
}

export const dictionaryApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    getDictionarySuggestions: build.query({
      query: (debouncedSearchTerm) => {
        const encodedWord = encodeURIComponent(debouncedSearchTerm);
        return {
          url: `/dictionary/suggestion?searchTerm=${encodedWord}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.dictionary],
      transformResponse: (response: DictionarySuggestion | undefined) => {
        if (!response || response === undefined) {
          return { data: [] };
        }
        return response;
      },
    }),
    getDictionaryWord: build.query({
      query: (id) => ({
        url: `/dictionary/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.dictionary],
    }),
  }),
});

export const { useGetDictionarySuggestionsQuery, useGetDictionaryWordQuery } =
  dictionaryApi;
