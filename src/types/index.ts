export type IMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ResponseSuccessType<T = unknown> = {
  data: T;
  meta?: IMeta;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
