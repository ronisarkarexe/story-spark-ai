import { AxiosResponseHeaders, AxiosRequestConfig } from "axios";

export interface IMeta {
  limit: number;
  page: number;
  total: number;
  nextCursor?: string;
  hasMore?: boolean;
}

export interface ResponseSuccessType<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig;
}

export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}

export interface ResponseErrorType {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}

export interface IParams {
  params: {
    id: string;
  };
}

export interface NetworkErrorResponse {
  status: number | undefined;
  data: string;
}
