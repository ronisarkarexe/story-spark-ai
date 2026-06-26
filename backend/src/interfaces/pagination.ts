import { SortOrder } from "mongoose";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    nextCursor?: string;
    hasMore?: boolean;
  };
  data: T;
}
