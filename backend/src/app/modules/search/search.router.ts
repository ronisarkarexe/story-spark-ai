import express from "express";
import { SearchController } from "./search.controller";
import { searchRateLimiter } from "../../middleware/rateLimit.middleware";

const router = express.Router();

// GET /api/v1/search?q=&type=&genre=&sortBy=&page=&limit=
router.get("/", searchRateLimiter, SearchController.search);

export const SearchRouter = router;