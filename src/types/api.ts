export interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
