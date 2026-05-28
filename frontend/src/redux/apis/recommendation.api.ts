import baseApi from "../base_api/base.api";

interface RecommendationPost {
  _id: string;
  title: string;
  imageURL: string;
  author?: {
    name?: string;
  };
  emotions?: string[];
}

interface PersonalizedRecommendationsResponse {
  data: RecommendationPost[];
}

const recommendationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPersonalizedRecommendations: build.query<RecommendationPost[], void>({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
      }),
      transformResponse: (response: PersonalizedRecommendationsResponse) => response.data,
      providesTags: ["Recommendation"],
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
