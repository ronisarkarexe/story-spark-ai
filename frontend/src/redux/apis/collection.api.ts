import { Collection } from "../../models/collection";
import baseApi from "../base_api/base.api";
import { COLLECTIONS_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

const collectionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCollection: build.mutation({
      query: (data: {
        title: string;
        description?: string;
        coverImageUrl?: string;
        visibility?: "public" | "private";
      }) => ({
        url: `/${COLLECTIONS_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.collection],
    }),

    updateCollection: build.mutation({
      query: (arg: {
        id: string;
        data: Partial<{
          title: string;
          description: string;
          coverImageUrl: string;
          visibility: "public" | "private";
          storyIds: string[];
        }>;
      }) => ({
        url: `/${COLLECTIONS_URL}/${arg.id}`,
        method: "PATCH",
        data: arg.data,
      }),
      invalidatesTags: [tagTypes.collection],
    }),

    getCollectionById: build.query<Collection, string>({
      query: (id: string) => ({
        url: `/${COLLECTIONS_URL}/${id}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Collection }) => res.data,
      providesTags: [tagTypes.collection],
    }),

    getUserCollections: build.query<Collection[], string>({
      query: (userId: string) => ({
        url: `/${COLLECTIONS_URL}/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (res: { data: Collection[] }) => res.data,
      providesTags: [tagTypes.collection],
    }),

    addStoryToCollection: build.mutation({
      query: (arg: { collectionId: string; storyId: string }) => ({
        url: `/${COLLECTIONS_URL}/${arg.collectionId}/stories`,
        method: "POST",
        data: { storyId: arg.storyId },
      }),
      invalidatesTags: [tagTypes.collection],
    }),

    removeStoryFromCollection: build.mutation({
      query: (arg: { collectionId: string; storyId: string }) => ({
        url: `/${COLLECTIONS_URL}/${arg.collectionId}/stories/${arg.storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.collection],
    }),

    deleteCollection: build.mutation({
      query: (id: string) => ({
        url: `/${COLLECTIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.collection],
    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useGetCollectionByIdQuery,
  useGetUserCollectionsQuery,
  useAddStoryToCollectionMutation,
  useRemoveStoryFromCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;
