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
  createdAt: string;
  updatedAt: string;
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
  useDeleteCharacterMutation,
} = characterApi;
