export interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type TApiError = {
  data?: {
    message?: string;
  };
  message?: string;
};
