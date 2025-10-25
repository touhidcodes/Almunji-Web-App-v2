import { IMeta } from "@/types";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { instance as axiosInstance } from "./axiosInstance";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      meta?: IMeta;
      contentType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers, contentType }) => {
    const config = {
      url: baseUrl + url,
      method,
      data,
      params,
      headers: {
        ...headers,
        "Content-Type": contentType || "application/json",
      },
    };
    // console.log("Axios Config:", config);

    try {
      console.log(url, "url");
      const result = await axiosInstance(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      console.log(err, "as err");
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
