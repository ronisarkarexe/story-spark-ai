import baseApi from "../base_api/base.api";
import { READING_PROGRESS_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const readingProgressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    saveReadingProgress: build.mutation({
      query: (data: { storyId: string; progress: number; lastScrollPosition?: number }) => ({
        url: `/${READING_PROGRESS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.readingProgress],
    }),

    getReadingProgress: build.query({
      query: (storyId: string) => ({
        url: `/${READING_PROGRESS_URL}/${storyId}`,
        method: "GET",
      }),
      providesTags: (result, error, storyId) => [
        { type: tagTypes.readingProgress, id: storyId },
      ],
    }),

    getRecentReadingProgress: build.query({
      query: (arg?: { limit?: number }) => ({
        url: `/${READING_PROGRESS_URL}/recent`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.readingProgress],
    }),

    deleteReadingProgress: build.mutation({
      query: (storyId: string) => ({
        url: `/${READING_PROGRESS_URL}/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.readingProgress],
    }),
  }),
});

export const {
  useSaveReadingProgressMutation,
  useGetReadingProgressQuery,
  useGetRecentReadingProgressQuery,
  useDeleteReadingProgressMutation,
} = readingProgressApi;

export default readingProgressApi;
