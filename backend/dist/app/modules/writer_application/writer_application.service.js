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
exports.WriterApplicationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const user_model_1 = require("../user/user.model");
const writer_application_model_1 = require("./writer_application.model");
const user_1 = require("../../../enums/user");
const submitApplication = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingApp = yield writer_application_model_1.WriterApplication.findOne({ user: userId, status: "pending" });
    if (existingApp) {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "You already have a pending application.");
    }
    const result = yield writer_application_model_1.WriterApplication.create(Object.assign(Object.assign({}, payload), { user: userId }));
    yield user_model_1.User.findByIdAndUpdate(userId, { isApplyForWriter: true });
    return result;
});
const getAllApplications = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield writer_application_model_1.WriterApplication.find().populate("user").sort({ createdAt: -1 });
});
const updateApplicationStatus = (id, status, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield writer_application_model_1.WriterApplication.findById(id);
    if (!application) {
        throw new api_error_1.default(http_status_1.default.NOT_FOUND, "Application not found");
    }
    if (application.status !== "pending") {
        throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "Application is already processed");
    }
    application.status = status;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    yield application.save();
    if (status === "approved") {
        yield user_model_1.User.findByIdAndUpdate(application.user, {
            role: user_1.ENUM_USER_ROLE.WRITER,
        });
    }
    else {
        // If rejected, we might want to let them apply again by setting isApplyForWriter to false
        yield user_model_1.User.findByIdAndUpdate(application.user, { isApplyForWriter: false });
    }
    return application;
});
exports.WriterApplicationService = {
    submitApplication,
    getAllApplications,
    updateApplicationStatus,
};
