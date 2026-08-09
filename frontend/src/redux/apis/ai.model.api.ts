import { IStories } from "../../components/stories/stories.view.component";
import baseApi from "../base_api/base.api";
import { AI_MODEL_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const aiModelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generateModel: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/generate-model`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: IStories[]; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    generateFreeModel: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/generate-free-model`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: IStories[]; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    generateAlternateEndings: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/generate-alternate-endings`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { style: string; ending: string; fullStory: string }[]; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    generateFreeAlternateEndings: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/generate-free-alternate-endings`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { style: string; ending: string; fullStory: string }[]; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    remixStory: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/remix`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { title: string; content: string; tag: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    remixFreeStory: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/remix-free`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { title: string; content: string; tag: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model],
    }),
    translateStory: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/translate`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { title: string; content: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model],
    }),
    translateFreeStory: build.mutation({
      query: (data) => ({
        url: `/${AI_MODEL_URL}/translate-free`,
        method: "POST",
        data: data,
      }),
      transformResponse: (response: { data: { title: string; content: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model],
    }),
    continueStory: build.mutation({
      query: (data: { prompt: string; language?: string }) => ({
        url: `/${AI_MODEL_URL}/continue-story`,
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: { continuation: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model, tagTypes.user],
    }),
    continueFreeStory: build.mutation({
      query: (data: { prompt: string; language?: string }) => ({
        url: `/${AI_MODEL_URL}/continue-story-free`,
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: { continuation: string }; message: string }) => {
        return { data: response.data, message: response.message };
      },
      invalidatesTags: [tagTypes.model],
    }),
    getUsage: build.query<{ plan: string; usage: Record<string, { used: number; limit: number }>; resetsAt: string }, void>({
      query: () => ({
        url: `/usage/me`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
      providesTags: [tagTypes.user, tagTypes.model],
    }),
  }),
});

export const {
  useGenerateModelMutation,
  useGenerateFreeModelMutation,
  useGenerateAlternateEndingsMutation,
  useGenerateFreeAlternateEndingsMutation,
  useRemixStoryMutation,
  useRemixFreeStoryMutation,
  useTranslateStoryMutation,
  useTranslateFreeStoryMutation,
  useContinueStoryMutation,
  useContinueFreeStoryMutation,
  useGetUsageQuery,
} = aiModelApi;

