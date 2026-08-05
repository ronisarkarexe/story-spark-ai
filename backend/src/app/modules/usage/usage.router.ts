import express from "express";

import auth from "../../middleware/auth.middleware";

import { UsageController } from "./usage.controller";


const router = express.Router();


router.get(
  "/me",
  auth(),
  UsageController.getMyUsage
);


export const UsageRouter = router;