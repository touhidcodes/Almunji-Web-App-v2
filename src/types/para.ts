export interface TCreateParaPayload {
  number: number;
  arabic: string;
  english?: string;
  bangla?: string;
  startAyahRef: string;
  endAyahRef: string;
}

export interface TUpdateParaPayload {
  number?: number;
  arabic?: string;
  english?: string | null;
  bangla?: string | null;
  startAyahRef?: string;
  endAyahRef?: string;
}
