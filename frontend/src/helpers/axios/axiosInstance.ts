import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  getFromLocalStorage,
} from "../../utils/local-storage";
import { AUTH_KEY } from "../../constants/storage-key";
import { getRefreshToken, storeTokens, removeTokens } from "../../services/auth.service";
import { IMeta, ResponseErrorType } from "../../types";
import { getBaseUrl } from "../config";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

type AxiosGlobalState = typeof globalThis & {
  __storySparkAxiosInstance?: AxiosInstance;
  __storySparkAxiosInterceptorsRegistered?: boolean;
};

const axiosGlobalState = globalThis as AxiosGlobalState;

const instance = axiosGlobalState.__storySparkAxiosInstance ?? axios.create();
axiosGlobalState.__storySparkAxiosInstance = instance;

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

interface ApiResponseData<T = unknown> {
  data: T;
  meta?: IMeta | undefined;
}

export const setupAxiosInterceptors = () => {
  if (axiosGlobalState.__storySparkAxiosInterceptorsRegistered) {
    return;
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          removeTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          const baseUrl = getBaseUrl();
          const response = await axios.post(
            `${baseUrl}/auth/refresh-token`,
            { token: refreshToken },
            { withCredentials: true },
          );

          const newAccessToken = response.data?.data?.accessToken;

          if (newAccessToken) {
            storeTokens({ accessToken: newAccessToken, refreshToken });
            instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          removeTokens();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      let errorObject: ResponseErrorType;
      if (error.code === "ERR_NETWORK") {
        errorObject = {
          statusCode: 503,
          message: "Service Unavailable - The server is currently unreachable",
          errorMessages: [
            {
              path: "",
              message: "The server is currently unavailable. Please try again later.",
            },
          ],
        };
      } else if (error.response) {
        errorObject = {
          statusCode: error.response.data?.statusCode || 500,
          message: error.response.data?.message || "Something went wrong!",
          errorMessages: error.response.data?.errorMessages || [],
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

  axiosGlobalState.__storySparkAxiosInterceptorsRegistered = true;
};

setupAxiosInterceptors();

export { instance };
