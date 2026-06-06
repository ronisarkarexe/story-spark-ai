import { DashboardAnalysis } from "../../models/analysis";
import baseApi from "../base_api/base.api";
import { ANALYSIS_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const analysisApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardAnalysis: build.query({
      query: () => ({
        url: `/${ANALYSIS_URL}/dashboard`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: DashboardAnalysis;
        message: string;
      }) => response.data,
      providesTags: [tagTypes.post, tagTypes.user],
    }),
  }),
});

export const { useGetDashboardAnalysisQuery } = analysisApi;
