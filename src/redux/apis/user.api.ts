import { User } from "../../models/user";
import { IMeta } from "../../types";
import baseApi from "../base_api/base.api";
import { USER_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    applyForWriter: build.mutation({
      query: (data) => ({
        url: `/${USER_URL}/apply-for-writer`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    getUsersList: build.query({
      query: () => ({
        url: `/${USER_URL}/lists`,
        method: "GET",
      }),
      transformResponse: (response: { data: User[]; message: string }) => {
        return { data: response.data };
      },

      providesTags: [tagTypes.user],
    }),
    getProfileInfo: build.query<User, void>({
      query: () => ({
        url: `/${USER_URL}/profile`,
        method: "GET",
      }),
      transformResponse: (response: {
        data: User;
        message: string;
        meta: IMeta;
      }) => response.data,
      providesTags: [tagTypes.user],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: `/${USER_URL}/update`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useApplyForWriterMutation,
  useGetUsersListQuery,
  useGetProfileInfoQuery,
  useUpdateProfileMutation,
} = userApi;
