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
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const node_cron_1 = __importDefault(require("node-cron"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const router_1 = require("./router");
const global_error_handler_1 = __importDefault(require("./app/middleware/global.error.handler"));
const user_model_1 = require("./app/modules/user/user.model");
const app = (0, express_1.default)();
app.set("trust proxy", 1); // Trust first proxy to securely read req.ip
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(limiter);
const defaultCorsOrigins = [
    "http://localhost:4001",
    "http://localhost:4002",
    "https://storysparkai-five.vercel.app",
];
const corsOrigins = config_1.default.cors_origins && config_1.default.cors_origins.length > 0
    ? config_1.default.cors_origins
    : defaultCorsOrigins;
// ── FIXED CORS MIDDLEWARE ENGINE (WITH CORRECTED SYNTAX BRACKETS) ──
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Blocked by Cross-Origin Resource Sharing (CORS) Policy"));
        } // <-- Safely closed the else statement block here
    }, // <-- Safely closed the origin function assignment here
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cookie"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Keeps your extended payload parsing enabled
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1", router_1.Routers);
// Global 404 Fallback Handler
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessage: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
});
app.use(global_error_handler_1.default);
// Cron job to reset request counts at the beginning of each month (skip on Vercel serverless)
if (!process.env.VERCEL) {
    node_cron_1.default.schedule("0 0 1 * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_model_1.User.updateMany({}, { $set: { requestsThisMonth: 0 } });
        }
        catch (error) {
            console.error("Failed to reset request counts:", error);
        }
    }));
}
exports.default = app;
