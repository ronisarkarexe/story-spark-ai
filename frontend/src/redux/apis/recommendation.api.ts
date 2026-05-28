import baseApi from "../base_api/base.api";

const recommendationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPersonalizedRecommendations: build.query({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Recommendation"] as any,
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
