export interface TDictionaryWord {
  id: string;
  word: string;
  pronunciation?: string;
  definition?: string;
  meaning?: string;
  root?: string;
  examples?: string[];
  verses?: string[];
}

export interface TDictionarySuggestionsResponse {
  data: TDictionaryWord[];
}

export interface TDictionaryWordResponse {
  data: TDictionaryWord;
}
