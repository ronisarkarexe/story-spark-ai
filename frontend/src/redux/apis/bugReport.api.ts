import baseApi from "../base_api/base.api";
import { BUG_REPORT_URL } from "../base_api/base.endpoints";

const bugReportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitBugReport: build.mutation({
      query: (data) => ({
        url: `/${BUG_REPORT_URL}/submit`,
        method: "POST",
        data: data,
      }),
    }),
  }),
});

export const { useSubmitBugReportMutation } = bugReportApi;
