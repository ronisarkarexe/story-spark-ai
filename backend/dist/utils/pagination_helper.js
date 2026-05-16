"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("../constants/pagination");
const paginationHelper = (option) => {
    const page = Math.max(pagination_1.DEFAULT_PAGE, Number(option.page) || pagination_1.DEFAULT_PAGE);
    const rawLimit = Number(option.limit) || pagination_1.DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, rawLimit), pagination_1.MAX_LIMIT);
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
exports.default = paginationHelper;
