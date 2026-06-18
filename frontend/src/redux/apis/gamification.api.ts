import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";
import { WritingStreak, Achievement } from "../../types";

const gamificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWritingStreak: build.query<WritingStreak, undefined>({
      query: () => ({
        url: "/users/me/streak",
        method: "GET",
      }),
      transformResponse: (response: { data: WritingStreak }) => response.data,
      providesTags: [tagTypes.user, tagTypes.post],
    }),
    getAchievements: build.query<{ achievements: Achievement[] }, undefined>({
      query: () => ({
        url: "/users/me/achievements",
        method: "GET",
      }),
      transformResponse: (response: { data: { achievements: Achievement[] } }) => response.data,
      providesTags: [tagTypes.user, tagTypes.post],
    }),
    updateWritingStreak: build.mutation<WritingStreak, undefined>({
      query: () => ({
        url: "/users/me/streak/update",
        method: "POST",
      }),
      transformResponse: (response: { data: WritingStreak }) => response.data,
      invalidatesTags: [tagTypes.user, tagTypes.post],
    }),
  }),
});

export const {
  useGetWritingStreakQuery,
  useGetAchievementsQuery,
  useUpdateWritingStreakMutation,
} = gamificationApi;
