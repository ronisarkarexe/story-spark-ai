"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (option) => {
    const page = Number(option.page || 1);
    const limit = Number(option.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = option.sortBy || "createdAt";
    const orderBy = option.sortOrder || option.orderBy || "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        orderBy,
    };
};
exports.default = paginationHelper;
