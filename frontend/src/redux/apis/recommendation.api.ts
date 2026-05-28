import baseApi from "../base_api/base.api";
import type { Post } from "../../models/post";

type RecommendationResponse = {
  data: Post[];
};

const recommendationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPersonalizedRecommendations: build.query<Post[], void>({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
      }),
      transformResponse: (response: RecommendationResponse) => response.data,
      providesTags: ["Recommendation"],
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
