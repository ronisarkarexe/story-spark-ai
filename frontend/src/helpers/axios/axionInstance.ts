import axios, { AxiosResponse } from "axios";
import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from "../../utils/local-storage";
import { AUTH_KEY } from "../../constants/storage-key";
import { IMeta, ResponseErrorType } from "../../types";
import { getBaseUrl } from "../config";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

export interface ApiResponseData<T = unknown> {
  data: T;
  meta?: IMeta | undefined;
}

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(AUTH_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponseData>) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const baseUrl = getBaseUrl();
        const response = await axios.post(
          `${baseUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }, // sends the httpOnly refresh token cookie
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          setToLocalStorage(AUTH_KEY, newAccessToken);
          originalRequest.headers.Authorization = newAccessToken;
          return instance(originalRequest); // retry original request
        }
      } catch {
        // Refresh failed — clear session and redirect to login
        removeFromLocalStorage(AUTH_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    let errorObject: ResponseErrorType;
    if (error.code === "ERR_NETWORK") {
      errorObject = {
        statusCode: 503,
        message: "Network Error - Unable to connect to the server",
        errorMessages: [
          {
            path: "",
            message: "Please check your internet connection and try again",
          },
        ],
      };
    } else if (error.response) {
      errorObject = {
        statusCode: error.response.data?.statusCode || 500,
        message: error.response.data?.message || "Something went wrong!",
        errorMessages: error.response.data?.errorMessage || [],
      };
    } else {
      errorObject = {
        statusCode: 500,
        message: error.message || "Something went wrong!",
        errorMessages: [
          {
            path: "",
            message: "An unexpected error occurred",
          },
        ],
      };
    }
    return Promise.reject(errorObject);
  },
);

export { instance };
