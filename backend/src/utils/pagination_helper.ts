import { SortOrder } from "mongoose";

interface IOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  orderBy?: SortOrder;
  sortOrder?: SortOrder;
}

interface PGOptions {
  page: number;
  limit: number;
  skip: number;
  cursor?: string;
  sortBy: string;
  orderBy: SortOrder;
}

const paginationHelper = (option: IOptions): PGOptions => {
  const page = Number(option.page || 1);
  const limit = Number(option.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = option.sortBy || "createdAt";
  const orderBy = option.sortOrder || option.orderBy || "desc";
  return {
    page,
    limit,
    skip,
    cursor: typeof option.cursor === "string" ? option.cursor : undefined,
    sortBy,
    orderBy,
  };
};
export default paginationHelper;
