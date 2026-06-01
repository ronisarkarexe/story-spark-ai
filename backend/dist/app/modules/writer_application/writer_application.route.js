"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const writer_application_controller_1 = require("./writer_application.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const writer_application_validation_1 = require("./writer_application.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validate_request_1.default)(writer_application_validation_1.WriterApplicationValidation.submitApplicationZodSchema), writer_application_controller_1.WriterApplicationController.submitApplication);
router.get("/", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), writer_application_controller_1.WriterApplicationController.getAllApplications);
router.patch("/:id", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(writer_application_validation_1.WriterApplicationValidation.updateApplicationStatusZodSchema), writer_application_controller_1.WriterApplicationController.updateApplicationStatus);
exports.WriterApplicationRoutes = router;
