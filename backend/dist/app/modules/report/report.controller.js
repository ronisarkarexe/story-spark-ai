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
exports.ReportController = void 0;
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const report_service_1 = require("./report.service");
const createReport = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reportedBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const payload = Object.assign(Object.assign({}, req.body), { reportedBy });
    const result = yield report_service_1.ReportService.createReport(payload);
    (0, send_response_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Report submitted successfully",
        data: result,
    });
}));
const getAllReports = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield report_service_1.ReportService.getAllReports();
    (0, send_response_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reports fetched successfully",
        data: result,
    });
}));
exports.ReportController = { createReport, getAllReports };
