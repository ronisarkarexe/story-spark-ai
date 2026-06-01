"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.default = handler;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const dns_1 = __importDefault(require("dns"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jwt_helper_1 = require("./utils/jwt.helper");
const logger_util_1 = __importDefault(require("./utils/logger.util"));
dns_1.default.setServers(["1.1.1.1", "8.8.8.8"]);
if (config_1.default.disable_logs) {
    const noop = () => undefined;
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = noop;
    console.error = noop;
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 1)
            return;
        // config.database_url is guaranteed non-empty by config/index.ts — it throws at
        // module load time if DATABASE_URL is missing, so no runtime guard is needed here.
        yield mongoose_1.default.connect(config_1.default.database_url);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield connectDB().catch((error) => {
                logger_util_1.default.error("Error connecting to the database on startup:", error);
            });
            const httpServer = http_1.default.createServer(app_1.default);
            const io = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: ((_a = config_1.default.cors_origins) === null || _a === void 0 ? void 0 : _a.length)
                        ? config_1.default.cors_origins
                        : ["http://localhost:4001", "https://storysparkai-five.vercel.app"],
                    credentials: true,
                },
            });
            const [{ setNotificationSocket }, { setupCollabSocket }] = yield Promise.all([
                Promise.resolve().then(() => __importStar(require("./socket/notification.socket"))),
                Promise.resolve().then(() => __importStar(require("./socket/collab.socket"))),
            ]);
            setNotificationSocket(io);
            setupCollabSocket(io);
            io.use((socket, next) => {
                var _a;
                try {
                    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
                    if (!token) {
                        return next(new Error("Unauthorized"));
                    }
                    const verifiedUser = jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
                    const userId = verifiedUser._id || verifiedUser.userId || verifiedUser.sub || verifiedUser.id;
                    if (!userId) {
                        return next(new Error("Unauthorized"));
                    }
                    socket.data.userId = userId.toString();
                    next();
                }
                catch (error) {
                    next(new Error("Unauthorized"));
                }
            });
            io.on("connection", (socket) => {
                const userId = socket.data.userId;
                if (userId) {
                    socket.join(`user:${userId}`);
                }
            });
            httpServer.listen(config_1.default.port, () => {
                logger_util_1.default.info(`Story-Spark-AI app listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            logger_util_1.default.error("Error in main startup sequence:", error);
        }
    });
}
/**
 * Vercel (@vercel/node) invokes the default export; Express alone must not call listen().
 */
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectDB();
        }
        catch (error) {
            logger_util_1.default.error("Error connecting to the database:", error);
            res.status(500).json({
                success: false,
                message: "Database unavailable",
            });
            return;
        }
        app_1.default(req, res);
    });
}
if (process.env.VERCEL !== "1") {
    void main();
}
