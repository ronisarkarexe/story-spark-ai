import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import { instance as AxiosInstance } from "./axiosInstance";
import { IMeta, ResponseErrorType } from "../../types";

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
  async ({ url, method, data, params, contentType }, api) => {
    try {
      const result = await AxiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        signal: api.signal,
        headers: {
          "Content-Type": contentType || "application/json",
        },
      });
      return {
        data: result.data,
        meta: result.data.meta,
        message: result.data.message,
      };
    } catch (axiosError) {
      const err = axiosError as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };
      
      if (api.signal.aborted) {
        return {
          error: {
            status: "CANCELLED",
            data: [{ path: "", message: "Story generation was cancelled." }],
          },
        };
      }

      // Check if the message contains our unique key error phrase
      const backendErrorData = err.response?.data;
      if (backendErrorData && backendErrorData.message?.includes("ERROR_MISSING_API_KEY")) {
        return {
          error: {
            status: err.response?.status || 500,
            code: "MISSING_API_KEY",
            message: "AI Generation provider keys are not configured on the server. Please check your backend/.env file.",
            data: [{ path: "api_key", message: backendErrorData.message }]
          },
        };
      }
      
      // Fallback structural layout mapping for ordinary errors
      const standardErr = axiosError as ResponseErrorType;
      return {
        error: {
          status: standardErr.statusCode,
          data: standardErr.errorMessages || [{ path: "", message: standardErr.message }],
        },
      };
    }
  };

export default axiosBaseQuery;