"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
// User List
router.get("/lists", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getAllUsers);
// Profile
router.get("/profile", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getProfileInfo);
// Apply for Writer
router.get("/writer-application-list", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getAllWriterApplicationUsers);
// Get Single User
router.get("/:id", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getUser);
// Update Single User
router.patch("/update", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(user_validation_1.UserValidator.updateUser), user_controller_1.UserController.updateUser);
// Delete Single User
router.delete("/:id", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.deleteUser);
// Apply for Writer
router.post("/apply-for-writer", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER), user_controller_1.UserController.applyForWriter);
// Apply for Writer
router.post("/approve-writer-application", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.approveWriterApplication);
// Follow / Unfollow
router.post("/follow/:authorId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.toggleFollow);
// Get Follow Status
router.get("/follow-status/:authorId", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controller_1.UserController.getFollowStatus);
exports.UserRouter = router;
