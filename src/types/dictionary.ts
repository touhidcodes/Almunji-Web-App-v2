export type TDictionaryApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T[] | T;
};
export interface TCreateDictionaryWord {
  persianWord: string;
  transliteration: string;
  banglaMeaning: string;
  englishMeaning: string;
  exampleFA: string;
  exampleEN: string;
  exampleBN: string;
}

export type TDictionary = {
  id: string;
  persianWord: string;
  transliteration: string | null;
  banglaMeaning: string;
  englishMeaning: string | null;
  exampleFA: string | null;
  exampleEN: string | null;
  exampleBN: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TDictionaryWord = {
  id: string;
  persianWord: string;
  transliteration?: string;
  banglaMeaning: string;
  englishMeaning?: string;
  exampleFA?: string;
  exampleEN?: string;
  exampleBN?: string;
};

export type TDictionaryApiWord = Partial<TDictionaryWord> & {
  _id?: string;
  word?: string;
  pronunciation?: string;
  meaning?: string;
  definition?: string;
};

export type TUpdateDictionaryWord = Partial<TCreateDictionaryWord>;

export type TDictionarySuggestionParams = {
  searchTerm: string;
};

export type TDictionaryAdminParams = {
  page?: number;
  limit?: number;
  search?: string;
  isDeleted?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TUpdateDictionaryPayload = {
  id: string;
  data: TUpdateDictionaryWord;
};
