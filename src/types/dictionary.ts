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
