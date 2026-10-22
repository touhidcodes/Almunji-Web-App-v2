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
