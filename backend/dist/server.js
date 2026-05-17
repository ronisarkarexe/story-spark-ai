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
exports.default = handler;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const dns_1 = __importDefault(require("dns"));
dns_1.default.setServers(["1.1.1.1", "8.8.8.8"]);
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mongoose_1.default.connection.readyState === 1)
            return;
        yield mongoose_1.default.connect(config_1.default.database_url);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!config_1.default.database_url) {
                throw new Error("DATABASE_URL is not set. Copy backend/.env.example to backend/.env and configure MongoDB.");
            }
            if (config_1.default.env !== "production") {
                console.log("Connecting to MongoDB...");
            }
            yield connectDB();
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Story-Spark-AI app listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
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
            console.error("Error connecting to the database:", error);
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
