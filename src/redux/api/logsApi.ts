import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export interface TLogSummaryParams {
  level?: "error" | "warn" | "info";
  dateFrom?: string;
  dateTo?: string;
}

export interface TLogsQueryParams {
  level?: "error" | "warn" | "info";
  category?: "HTTP" | "DB" | "DB_ERROR" | "SERVER" | "OTHER";
  dateFrom?: string;
  dateTo?: string;
  method?: string;
  statusCode?: number;
  model?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortOrder?: "desc" | "asc";
}

export interface TLogFileQueryParams {
  level?: "error" | "warn" | "info";
  page?: number;
  limit?: number;
  sortOrder?: "desc" | "asc";
}

export const logsApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all available log files
    getLogFiles: build.query({
      query: () => ({
        url: "/logs/files",
        method: "GET",
      }),
      providesTags: [tagTypes.logs],
    }),

    // Get log analytics summary
    getLogSummary: build.query({
      query: (params: TLogSummaryParams = {}) => ({
        url: "/logs/summary",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.logs],
    }),

    // Get logs from a specific file
    getLogsByFile: build.query({
      query: ({
        filename,
        ...params
      }: TLogFileQueryParams & { filename: string }) => ({
        url: `/logs/file/${encodeURIComponent(filename)}`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.logs],
    }),

    // Get all logs with filtering and pagination
    getLogs: build.query({
      query: (params: TLogsQueryParams = {}) => ({
        url: "/logs",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.logs],
    }),
  }),
});

export const {
  useGetLogFilesQuery,
  useGetLogSummaryQuery,
  useGetLogsByFileQuery,
  useGetLogsQuery,
} = logsApi;
