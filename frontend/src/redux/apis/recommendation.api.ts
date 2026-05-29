import baseApi from "../base_api/base.api";
import { Post } from "../../models/post";

const recommendationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPersonalizedRecommendations: build.query<Post[], void>({
      query: () => ({
        url: "/recommendations/personalized",
        method: "GET",
      }),
      transformResponse: (response: { data: Post[] }) => response.data,
      providesTags: ["Recommendation"],
    }),
  }),
});

export const { useGetPersonalizedRecommendationsQuery } = recommendationApi;
