import baseApi from "../base_api/base.api";
import { USER_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const writerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    applyForWriter: build.mutation({
      query: (data) => ({
        url: `/${USER_URL}/apply-for-writer`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    approveWriterApplication: build.mutation({
      query: (data) => ({
        url: `/${USER_URL}/approve-writer-application`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useApplyForWriterMutation,
  useApproveWriterApplicationMutation,
} = writerApi;
