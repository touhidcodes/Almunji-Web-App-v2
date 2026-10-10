export interface TWordSuggestion {
  id: string;
  word: string;
  pronunciation?: string;
  definition?: string;
}

export interface TWordDetails {
  id: string;
  word: string;
  pronunciation?: string;
  definition?: string;
  meaning?: string;
  root?: string;
  examples?: string[];
  verses?: string[];
}

export type TDictionaryWord = {
  id: string;
  persianWord: string;
  transliteration?: string;
  englishMeaning: string;
  banglaMeaning?: string;
};

export type TDictionaryWordUpdatePayload = {
  persianWord: string;
  transliteration: string;
  englishMeaning: string;
  banglaMeaning: string;
};

export type TManagedDictionaryWord = {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  meaning: string;
};

export type TDictionaryApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T[] | T;
};
