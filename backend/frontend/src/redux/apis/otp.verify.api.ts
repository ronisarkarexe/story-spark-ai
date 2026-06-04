import baseApi from "../base_api/base.api";
import { OTP_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const otpVerifyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    emailVerify: build.mutation({
      query: (data) => ({
        url: `/${OTP_URL}/verify-email`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.otp],
    }),
    verifyOtp: build.mutation({
      query: (data) => ({
        url: `/${OTP_URL}/verify-otp`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.otp],
    }),
  }),
});

export const { useEmailVerifyMutation, useVerifyOtpMutation } = otpVerifyApi;
