import axios, { AxiosResponse } from "axios";
import { getFromLocalStorage } from "../../utils/local-storage";
import { AUTH_KEY } from "../../constants/storage-key";
import { IMeta, ResponseErrorType } from "../../types";
import { isTokenExpired, removeUserInfo } from "../../services/auth.service";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;
instance.defaults.withCredentials = true;

export interface ApiResponseData<T = unknown> {
  data: T;
  meta?: IMeta | undefined;
}

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(AUTH_KEY);
    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = accessToken;
    } else if (accessToken) {
      removeUserInfo();
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
      if ((error.response.status === 401 || error.response.status === 403) && getFromLocalStorage(AUTH_KEY)) {
        removeUserInfo();
      }
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
  }
);

export { instance };
