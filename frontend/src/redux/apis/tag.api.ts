import baseApi from "../base_api/base.api";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPopularTags: build.query<{ name: string; count: number }[], void>({
      query: () => ({
        url: "/tags/popular",
        method: "GET",
      }),
      transformResponse: (response: { data: { name: string; count: number }[] }) => response.data,
    }),
    suggestTags: build.mutation<string[], { title: string; content: string }>({
      query: (data) => ({
        url: "/tags/suggest",
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: string[] }) => response.data,
    }),
    renameTag: build.mutation<void, { oldTag: string; newTag: string }>({
      query: (data) => ({
        url: "/tags/rename",
        method: "PATCH",
        data,
      }),
    }),
    deleteTag: build.mutation<void, string>({
      query: (tag) => ({
        url: `/tags/${tag}`,
        method: "DELETE",
      }),
    }),
    getRecommendations: build.query<any[], string>({
      query: (storyId) => ({
        url: `/tags/recommendations/${storyId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
    }),
  }),
});

export const {
  useGetPopularTagsQuery,
  useSuggestTagsMutation,
  useRenameTagMutation,
  useDeleteTagMutation,
  useGetRecommendationsQuery,
} = tagApi;
