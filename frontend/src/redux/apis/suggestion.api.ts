import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

const SUGGESTIONS_URL = "suggestions";

const suggestionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generateSuggestion: build.mutation({
      query: (data) => ({
        url: `/${SUGGESTIONS_URL}/generate`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.model],
    }),
    acceptSuggestion: build.mutation({
      query: (id) => ({
        url: `/${SUGGESTIONS_URL}/accept/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.model],
    }),
    rejectSuggestion: build.mutation({
      query: (id) => ({
        url: `/${SUGGESTIONS_URL}/reject/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.model],
    }),
    getSuggestionsHistory: build.query({
      query: (arg: { page?: number; limit?: number } = {}) => ({
        url: `/${SUGGESTIONS_URL}/history`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.model],
    }),
    deleteSuggestionFromHistory: build.mutation({
      query: (id) => ({
        url: `/${SUGGESTIONS_URL}/history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.model],
    }),
  }),
});

export const {
  useGenerateSuggestionMutation,
  useAcceptSuggestionMutation,
  useRejectSuggestionMutation,
  useGetSuggestionsHistoryQuery,
  useDeleteSuggestionFromHistoryMutation,
} = suggestionApi;
