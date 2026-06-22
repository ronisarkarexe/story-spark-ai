import baseApi from "../base_api/base.api";
import { STORY_RATING_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";
import { IStoryRating, IRatingResponse, IRateStoryPayload } from "../../models/story_rating";
import { IMeta } from "../../types";

const storyRatingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    rateStory: build.mutation<{ message: string; data: IStoryRating }, IRateStoryPayload>({
      query: (data) => ({
        url: `/${STORY_RATING_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.post],
    }),

    getStoryRatings: build.query<{ data: IStoryRating[]; meta: IMeta }, { storyId: string; page?: number; limit?: number }>({
      query: ({ storyId, page = 1, limit = 10 }) => ({
        url: `/${STORY_RATING_URL}/${storyId}/ratings`,
        method: "GET",
        params: { page, limit },
      }),
    }),

    getAverageRating: build.query<{ data: IRatingResponse }, string>({
      query: (storyId) => ({
        url: `/${STORY_RATING_URL}/${storyId}/average`,
        method: "GET",
      }),
      providesTags: [tagTypes.post],
    }),

    deleteRating: build.mutation<{ message: string }, string>({
      query: (ratingId) => ({
        url: `/${STORY_RATING_URL}/${ratingId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.post],
    }),
  }),
});

export const {
  useRateStoryMutation,
  useGetStoryRatingsQuery,
  useGetAverageRatingQuery,
  useDeleteRatingMutation,
} = storyRatingApi;

export default storyRatingApi;
