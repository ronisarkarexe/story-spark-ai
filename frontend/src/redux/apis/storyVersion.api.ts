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

export interface Character {
  id: string;
  name: string;
  [key: string]: unknown; // extensible — add known fields as the API stabilises
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  [key: string]: unknown;
}

export interface CharacterNetworkResponse {
  characters: Character[];
  relationships: Relationship[];
}

const storyVersionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVersionsByStoryId: build.query({
      query: (storyId: string) => ({
        url: `/story/${storyId}/versions`,
        method: "GET",
      }),
      providesTags: [tagTypes.StoryVersion],
    }),

    restoreVersion: build.mutation({
      query: (versionId: string) => ({
        url: `/story/version/${versionId}/restore`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.StoryVersion],
    }),

    getStoryTree: build.query<StoryTreeResponse, string>({
      query: (storyId: string) => ({
        url: `/story/${storyId}/tree`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: StoryTreeResponse;
      }) => response.data,
      providesTags: [tagTypes.StoryVersion],
    }),

    getBranchPath: build.query({
      query: (versionId: string) => ({
        url: `/story/version/${versionId}/path`,
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
        url: `/story/version/${versionId}/branch`,
        method: "POST",
        data: {
          branchName,
        },
      }),
      invalidatesTags: [tagTypes.StoryVersion],
    }),

    getCharacterNetwork: build.query<CharacterNetworkResponse, string>({
      query: (storyId: string) => ({
        url: `/story/${storyId}/character-network`,
        method: "GET",
      }),
      transformResponse: (response: { data: CharacterNetworkResponse }) => response.data,
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


