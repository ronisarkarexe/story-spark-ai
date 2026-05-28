import baseApi from "../base_api/base.api";
import { Review } from "../../models/review";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReviews: build.query({
      query: () => ({
        url: "/review/lists",
        method: "GET",
      }),

      transformResponse: (response: {
        data: Review[];
        message: string;
      }) => response.data,
    }),

    getPendingReviews: build.query({
      query: () => ({
        url: "/review/pending",
        method: "GET",
      }),

      transformResponse: (response: {
        data: Review[];
        message: string;
      }) => response.data,
    }),

    approveReview: build.mutation({
      query: (id: string) => ({
        url: `/review/${id}`,
        method: "PATCH",
      }),
    }),
    
    createReview: build.mutation({
      query: (body: { name: string; role: string; feedback: string; rating: number }) => ({
        url: "/review/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useCreateReviewMutation,
} = reviewApi;