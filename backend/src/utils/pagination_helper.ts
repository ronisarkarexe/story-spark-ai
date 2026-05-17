import { SortOrder } from "mongoose";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "../constants/pagination";

interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: SortOrder;
}

interface PGOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  orderBy: SortOrder;
}

const paginationHelper = (option: IOptions): PGOptions => {
  const page = Math.max(DEFAULT_PAGE, Number(option.page) || DEFAULT_PAGE);
  const rawLimit = Number(option.limit) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
  const skip = (page - 1) * limit;
  const sortBy = option.sortBy || "createdAt";
  const orderBy = option.orderBy || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    orderBy,
  };
};
export default paginationHelper;
