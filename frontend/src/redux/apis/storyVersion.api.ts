/* eslint-disable */
import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

export interface StoryTreeNode {
  id: string;
  parentId: string | null;
  title: string;
  versionNumber: number;
  branchName: string | null;
  branchDepth: number;
}

export interface StoryTreeEdge {
  source: string;
  target: string;
}

export interface StoryTreeResponse {
  nodes: StoryTreeNode[];
  edges: StoryTreeEdge[];
}

const storyVersionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVersionsByStoryId: build.query({
      query: (storyId: string) => ({
        url: `/story-version/${storyId}/versions`,
        method: "GET",
      }),
      providesTags: [tagTypes.StoryVersion],
    }),

    restoreVersion: build.mutation({
      query: (versionId: string) => ({
        url: `/story-version/version/${versionId}/restore`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.StoryVersion],
    }),

    getStoryTree: build.query<StoryTreeResponse, string>({
      query: (storyId: string) => ({
        url: `/story-version/${storyId}/tree`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: StoryTreeResponse;
      }) => response.data,
      providesTags: [tagTypes.StoryVersion],
    }),

    getBranchPath: build.query({
      query: (versionId: string) => ({
        url: `/story-version/version/${versionId}/path`,
        method: "GET",
      }),
      providesTags: [tagTypes.StoryVersion],
    }),

    createBranchVersion: build.mutation({
      query: ({
        versionId,
        branchName,
      }: {
        versionId: string;
        branchName: string;
      }) => ({
        url: `/story-version/version/${versionId}/branch`,
        method: "POST",
        data: {
          branchName,
        },
      }),
      invalidatesTags: [tagTypes.StoryVersion],
    }),

    getCharacterNetwork: build.query<{ characters: any[]; relationships: any[] }, string>({
      query: (storyId: string) => ({
        url: `/story/${storyId}/character-network`,
        method: "GET",
      }),
      transformResponse: (response: { data: { characters: any[]; relationships: any[] } }) => response.data,
      providesTags: [tagTypes.StoryVersion],
    }),
  }),
});

export const {
  useGetVersionsByStoryIdQuery,
  useRestoreVersionMutation,
  useGetStoryTreeQuery,
  useGetBranchPathQuery,
  useCreateBranchVersionMutation,
  useGetCharacterNetworkQuery,
} = storyVersionApi;


