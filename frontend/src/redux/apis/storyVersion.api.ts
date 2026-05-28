import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

const storyVersionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVersionsByStoryId: build.query({
      query: (storyId: string) => ({
        url: `/story/${storyId}/versions`,
        method: "GET",
      }),
      providesTags: [tagTypes.post],
    }),
    restoreVersion: build.mutation({
      query: (versionId: string) => ({
        url: `/story/version/${versionId}/restore`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.post],
    }),
  }),
});

export const {
  useGetVersionsByStoryIdQuery,
  useRestoreVersionMutation,
} = storyVersionApi;
