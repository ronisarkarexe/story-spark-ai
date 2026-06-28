import { Post } from "../../models/post";
import { IMeta } from "../../types";
import baseApi from "../base_api/base.api";
import { POST_URL, STORIES_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

interface QueryErrorResponse {
  status?: number;
  data?: unknown;
}

const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPost: build.mutation({
      query: (data) => ({
        url: `/${POST_URL}/create`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.post, tagTypes.user],
    }),

    updatePost: build.mutation({
      query: (arg: { id: string; data: Record<string, unknown> }) => ({
        url: `/${POST_URL}/${arg.id}`,
        method: "PATCH",
        data: arg.data,
      }),
      invalidatesTags: [tagTypes.post],
    }),

    forkStory: build.mutation({
      query: (id: string) => ({
        url: `/${STORIES_URL}/${id}/fork`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.post, tagTypes.user],
    }),


    getPostLists: build.query({
      query: (arg: Record<string, string | number>) => ({
        url: `/${POST_URL}/lists`,
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

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch posts. Please try again later.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    getMyPublishedStories: build.query({
      query: (arg: Record<string, string | number>) => ({
        url: `/${POST_URL}/my-published-stories`,
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

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch your published stories.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    getLatestLists: build.query({
      query: () => ({
        url: `/${POST_URL}/latest-lists`,
        method: "GET",
      }),

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

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch latest posts. Please try again later.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    getFeaturedLists: build.query({
      query: () => ({
        url: `/${POST_URL}/feature-lists`,
        method: "GET",
      }),

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

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch featured posts. Please try again later.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    getPostById: build.query({
      query: (id: string) => ({
        url: `/${POST_URL}/${id}`,
        method: "GET",
      }),

      transformResponse: (response: { data: Post; message: string }) => {
        return response.data;
      },

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch post details.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    getPostByTag: build.query({
      // Accepts an object with tag and excludeId
      query: (arg: { tag: string; excludeId?: string }) => ({
        url: `/${POST_URL}/tag/${arg.tag}`,
        method: "GET",
        params: arg.excludeId ? { excludeId: arg.excludeId } : {},
      }),

      transformResponse: (response: { data: Post[]; message: string }) => {
        return response.data;
      },

      transformErrorResponse: (response: QueryErrorResponse) => {
        return {
          status: response?.status,
          message: "Unable to fetch posts by tag.",
        };
      },

      providesTags: [tagTypes.post],
    }),

    deletePost: build.mutation({
      query: (id: string) => ({
        url: `/${POST_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        tagTypes.post,
        tagTypes.user,
        tagTypes.comment,
        tagTypes.bookmark,
      ],
    }),

    getGenres: build.query<string[], void>({
      query: () => ({
        url: `/${POST_URL}/genres`,
        method: "GET",
      }),
      transformResponse: (response: { data: string[] }) => response.data,
      providesTags: [tagTypes.post],
    }),

    getStoryTree: build.query<{ nodes: Record<string, unknown>[] }, string>({
      query: (rootStoryId: string) => ({
        url: `/stories/${rootStoryId}/tree`,
        method: "GET",
      }),
      transformResponse: (response: { data: { nodes: Record<string, unknown>[] } }) => response.data,
      providesTags: [tagTypes.post],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useForkStoryMutation,
  useGetPostListsQuery,
  useGetMyPublishedStoriesQuery,
  useGetLatestListsQuery,
  useGetFeaturedListsQuery,
  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useGetPostByTagQuery,
  useDeletePostMutation,
  useGetGenresQuery,
  useGetStoryTreeQuery,
} = postApi;
