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

export interface TPaginatedResponse<T> {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
