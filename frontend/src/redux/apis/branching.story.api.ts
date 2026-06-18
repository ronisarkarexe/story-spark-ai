import baseApi from "../base_api/base.api";

export interface BranchingStoryResponse {
  storySegment: string;
  choices: string[];
  segmentIndex: number;
}

export interface BranchingStoryRequest {
  storyContext: string;
  selectedChoice: string;
  genre?: string;
}

export interface BranchingStoryApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BranchingStoryResponse;
}

const branchingStoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBranchingStory: build.mutation({
      query: (data: BranchingStoryRequest) => ({
        url: "/stories/branching",
        method: "POST",
        data,
      }),
      transformResponse: (response: BranchingStoryApiResponse) => {
        return { data: response.data, message: response.message };
      },
    }),
  }),
});

export const { useCreateBranchingStoryMutation } = branchingStoryApi;