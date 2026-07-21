import baseApi from "../base_api/base.api";
import { CHARACTER_URL } from "../base_api/base.endpoints";
import { tagTypes } from "../tag-types";

export interface SaveCharacterParams {
  name: string;
  role?: string;
  personality: string;
}

export interface CharacterResponse extends SaveCharacterParams {
  _id: string;
  userId: string;
  portraitUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CharacterApiResponse {
  success: boolean;
  message?: string;
  data: CharacterResponse;
}

const characterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCharacters: build.query<{ success: boolean; data: CharacterResponse[] }, void>({
      query: () => ({
        url: `/${CHARACTER_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.character],
    }),
    saveCharacter: build.mutation<{ success: boolean; data: CharacterResponse }, SaveCharacterParams>({
      query: (data) => ({
        url: `/${CHARACTER_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.character],
    }),
    generateCharacterPortrait: build.mutation<CharacterApiResponse, string>({
      query: (id) => ({
        url: `/${CHARACTER_URL}/${id}/generate-portrait`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.character],
    }),
    deleteCharacter: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/${CHARACTER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.character],
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useSaveCharacterMutation,
  useGenerateCharacterPortraitMutation,
  useDeleteCharacterMutation,
} = characterApi;
