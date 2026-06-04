import baseApi from "../base_api/base.api";
import { REACTION_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const reactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    toggleReaction: build.mutation({
      query: (data) => ({
        url: `/${REACTION_URL}/toggle`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.post],
    }),
  }),
});

export const { useToggleReactionMutation } = reactionApi;
