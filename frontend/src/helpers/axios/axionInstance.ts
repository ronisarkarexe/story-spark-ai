import axios, { AxiosResponse } from "axios";
import { getFromLocalStorage, removeFromLocalStorage } from "../../utils/local-storage";
import { AUTH_KEY } from "../../constants/storage-key";
import { IMeta, ResponseErrorType } from "../../types";

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
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponseData>) => {
    return response;
  },
  function (error) {
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
      if (error.response.status === 401 || error.response.data?.statusCode === 401) {
        removeFromLocalStorage(AUTH_KEY);
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      errorObject = {
        statusCode: error.response.data?.statusCode || error.response.status || 500,
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
  }
);

export { instance };
