import { Post } from "../../models/post";
import { IMeta } from "../../types";
import baseApi from "../base_api/base.api";
import { BOOKMARK_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    toggleBookmark: build.mutation({
      query: (storyId: string) => ({
        url: `/${BOOKMARK_URL}/${storyId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.bookmark, tagTypes.post],
    }),

    getMyBookmarks: build.query({
      query: (arg: Record<string, string | number>) => ({
        url: `/${BOOKMARK_URL}`,
        method: "GET",
        params: arg,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const newArgs = { ...queryArgs };
        delete newArgs.page;
        return { endpointName, ...newArgs };
      },
      merge: (currentCache, newItems) => {
        if (!newItems.meta || newItems.meta.page === 1) {
          return newItems;
        }
        currentCache.posts.push(...newItems.posts);
        currentCache.meta = newItems.meta;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response: {
        data: Post[];
        meta: IMeta;
        message: string;
      }) => {
        return {
          posts: response.data,
          meta: response.meta,
          message: response.message,
        };
      },
      providesTags: [tagTypes.bookmark],
    }),

    checkBookmarkStatus: build.query({
      query: (storyId: string) => ({
        url: `/${BOOKMARK_URL}/status/${storyId}`,
        method: "GET",
      }),
      providesTags: (result, error, storyId) => [
        { type: tagTypes.bookmark, id: storyId },
      ],
    }),

    deleteBookmark: build.mutation({
      query: (storyId: string) => ({
        url: `/${BOOKMARK_URL}/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.bookmark, tagTypes.post],
    }),
  }),
});

export const {
  useToggleBookmarkMutation,
  useGetMyBookmarksQuery,
  useCheckBookmarkStatusQuery,
  useDeleteBookmarkMutation,
} = bookmarkApi;
export default bookmarkApi;
