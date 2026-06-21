const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export interface SearchParams {
  q: string;
  type?: "story" | "user" | "tag" | "all";
  genre?: string;
  sortBy?: "relevance" | "date" | "popularity";
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface StoryResult {
  _id: string;
  title: string;
  content: string;
  tag: string;
  genre?: string;
  author?: { name: string; profile?: { avatar?: string } };
  likesCount: number;
  viewsCount: number;
  createdAt: string;
}

export interface UserResult {
  _id: string;
  name: string;
  email: string;
  profile?: { avatar?: string; bio?: string };
}

export interface TagResult {
  tag: string;
}

export interface SearchResults {
  stories: { data: StoryResult[]; total: number; page: number; limit: number } | null;
  users: { data: UserResult[]; total: number; page: number; limit: number } | null;
  tags: { data: TagResult[]; total: number; page: number; limit: number } | null;
}

export const searchApi = async (params: SearchParams): Promise<SearchResults> => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  });

  const res = await fetch(`${BASE_URL}/search?${qs.toString()}`);
  if (!res.ok) throw new Error("Search request failed");

  const json = await res.json();
  return json.data as SearchResults;
};