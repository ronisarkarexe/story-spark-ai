import { AccessToken } from "../../models/login";
import baseApi from "../base_api/base.api";
import { AUTH_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/login`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: AccessToken }) => {
        return { data: response.data };
      },
      invalidatesTags: [tagTypes.user],
    }),
    googleLogin: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/google-login`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: AccessToken }) => {
        return { data: response.data };
      },
      invalidatesTags: [tagTypes.user],
    }),
    registerUser: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/register`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: AccessToken }) => {
        return { data: response.data };
      },
      invalidatesTags: [tagTypes.user],
    }),
    registerWithGoogle: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/register-google`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: AccessToken }) => {
        return { data: response.data };
      },
      invalidatesTags: [tagTypes.user],
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/forgot-password`,
        method: "POST",
        data: data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: `/${AUTH_URL}/reset-password`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: AccessToken }) => {
        return { data: response.data };
      },
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGoogleLoginMutation,
  useRegisterUserMutation,
  useRegisterWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;