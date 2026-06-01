"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const route_param_1 = require("../../../shared/route_param");
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const token_1 = require("../../middleware/token");
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.getAllUsers();
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "OK!",
            data: result,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            message: "Fail to get users!",
        });
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, route_param_1.routeParam)(req.params.id);
        const result = yield user_service_1.UserService.getUser(id);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "OK!",
            data: result,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            message: "Fail to get users!",
        });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, token_1.getToken)(req);
        const result = yield user_service_1.UserService.updateUser(token, req.body);
        (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User update successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            message: "Fail to get users!",
        });
    }
});
const deleteUser = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, route_param_1.routeParam)(req.params.id);
    yield user_service_1.UserService.deleteUser(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deleted successfully!",
    });
}));
const applyForWriter = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const result = yield user_service_1.UserService.applyForWriter(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Applied for writer successfully!",
        data: result,
    });
}));
const approveWriterApplication = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Defense-in-depth: verify caller is admin/super_admin at the controller level
    const token = yield (0, token_1.getToken)(req);
    if (token.role !== "admin" && token.role !== "super_admin") {
        throw new api_error_1.default(http_status_1.default.FORBIDDEN, "Only administrators can approve writer applications!");
    }
    const { email } = req.body;
    const result = yield user_service_1.UserService.approveWriterApplication(email);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Approve writer application successfully!",
        data: result,
    });
}));
const getAllWriterApplicationUsers = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllWriterApplicationUsers();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Approve writer application successfully!",
        data: result,
    });
}));
const getProfileInfo = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const result = yield user_service_1.UserService.getProfileInfo(token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get profile info successfully!",
        data: result,
    });
}));
const toggleFollow = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const authorId = (0, route_param_1.routeParam)(req.params.authorId);
    const result = yield user_service_1.UserService.toggleFollow(token, authorId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.isFollowing
            ? "Followed successfully!"
            : "Unfollowed successfully!",
        data: result,
    });
}));
const getFollowStatus = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, token_1.getToken)(req);
    const authorId = (0, route_param_1.routeParam)(req.params.authorId);
    const result = yield user_service_1.UserService.getFollowStatus(token, authorId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Follow status fetched successfully!",
        data: result,
    });
}));
exports.UserController = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getProfileInfo,
    applyForWriter,
    approveWriterApplication,
    getAllWriterApplicationUsers,
    toggleFollow,
    getFollowStatus,
};
