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
exports.WriterApplicationController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const http_status_1 = __importDefault(require("http-status"));
const writer_application_service_1 = require("./writer_application.service");
const token_1 = require("../../middleware/token");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const submitApplication = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const tokenPayload = (0, token_1.getToken)(req);
    const userId = tokenPayload._id || tokenPayload.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
    if (!userId) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "User ID could not be extracted from your session. Please try logging out and logging back in.");
    }
    const result = yield writer_application_service_1.WriterApplicationService.submitApplication(userId, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Writer application submitted successfully",
        data: result,
    });
}));
const getAllApplications = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield writer_application_service_1.WriterApplicationService.getAllApplications();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Writer applications retrieved successfully",
        data: result,
    });
}));
const updateApplicationStatus = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    const { status } = req.body;
    const tokenPayload = (0, token_1.getToken)(req);
    const adminId = tokenPayload._id || tokenPayload.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
    if (!adminId) {
        throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "Admin ID could not be extracted.");
    }
    const result = yield writer_application_service_1.WriterApplicationService.updateApplicationStatus(id, status, adminId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Writer application ${status} successfully`,
        data: result,
    });
}));
exports.WriterApplicationController = {
    submitApplication,
    getAllApplications,
    updateApplicationStatus,
};
