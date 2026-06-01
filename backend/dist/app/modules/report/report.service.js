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
exports.ReportService = void 0;
const report_model_1 = require("./report.model");
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
const createReport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield report_model_1.Report.create(payload);
        return result;
    }
    catch (error) {
        if (error.code === 11000) {
            throw new api_error_1.default(http_status_1.default.CONFLICT, "You have already reported this content");
        }
        throw error;
    }
});
const getAllReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_model_1.Report.find().populate("reportedBy", "name email");
    return result;
});
exports.ReportService = { createReport, getAllReports };
