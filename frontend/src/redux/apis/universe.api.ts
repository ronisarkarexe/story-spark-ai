import baseApi from "../base_api/base.api";
import { tagTypes } from "../tag-types";

export interface IUniversePayload {
  name: string;
  description: string;
  stories?: string[];
}

export interface IUniverse extends IUniversePayload {
  _id: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemoryPayload {
  type: string;
  title: string;
  content: string;
  attributes?: Record<string, any>;
  tags?: string[];
}

export interface IUniverseMemory extends IMemoryPayload {
  _id: string;
  universeId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const universeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUniverses: build.query<IUniverse[], void>({
      query: () => ({
        url: "/universes",
        method: "GET",
      }),
      transformResponse: (response: { data: IUniverse[] }) => response.data,
      providesTags: [tagTypes.universe as any],
    }),

    getUniverseById: build.query<IUniverse, string>({
      query: (id: string) => ({
        url: `/universes/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IUniverse }) => response.data,
      providesTags: [tagTypes.universe as any],
    }),

    createUniverse: build.mutation<IUniverse, IUniversePayload>({
      query: (data) => ({
        url: "/universes",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.universe as any, tagTypes.post as any],
    }),

    updateUniverse: build.mutation<IUniverse, { id: string; data: Partial<IUniversePayload> }>({
      query: ({ id, data }) => ({
        url: `/universes/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.universe as any, tagTypes.post as any],
    }),

    deleteUniverse: build.mutation<void, string>({
      query: (id) => ({
        url: `/universes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.universe as any, tagTypes.post as any],
    }),

    // Memory APIs
    getMemories: build.query<IUniverseMemory[], { universeId: string; type?: string; searchTerm?: string }>({
      query: ({ universeId, type, searchTerm }) => {
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (searchTerm) params.searchTerm = searchTerm;
        return {
          url: `/universes/${universeId}/memories`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response: { data: IUniverseMemory[] }) => response.data,
      providesTags: [tagTypes.universe as any],
    }),

    createMemory: build.mutation<IUniverseMemory, { universeId: string; data: IMemoryPayload }>({
      query: ({ universeId, data }) => ({
        url: `/universes/${universeId}/memories`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.universe as any],
    }),

    updateMemory: build.mutation<IUniverseMemory, { universeId: string; memoryId: string; data: Partial<IMemoryPayload> }>({
      query: ({ universeId, memoryId, data }) => ({
        url: `/universes/${universeId}/memories/${memoryId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.universe as any],
    }),

    deleteMemory: build.mutation<void, { universeId: string; memoryId: string }>({
      query: ({ universeId, memoryId }) => ({
        url: `/universes/${universeId}/memories/${memoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.universe as any],
    }),

    retrieveLore: build.mutation<IUniverseMemory[], { universeId: string; queryText: string }>({
      query: ({ universeId, queryText }) => ({
        url: `/universes/${universeId}/retrieve`,
        method: "POST",
        data: { queryText },
      }),
      transformResponse: (response: { data: IUniverseMemory[] }) => response.data,
    }),
  }),
});

export const {
  useGetUniversesQuery,
  useGetUniverseByIdQuery,
  useCreateUniverseMutation,
  useUpdateUniverseMutation,
  useDeleteUniverseMutation,
  useGetMemoriesQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
  useRetrieveLoreMutation,
} = universeApi;
