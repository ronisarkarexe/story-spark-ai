"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = void 0;
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("./report.controller");
const report_validation_1 = require("./report.validation");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validate_request_1.default)(report_validation_1.ReportValidation.createReport), report_controller_1.ReportController.createReport);
router.get("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), report_controller_1.ReportController.getAllReports);
exports.ReportRouter = router;
