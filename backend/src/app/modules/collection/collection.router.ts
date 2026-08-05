import express from "express";
import rateLimit from "express-rate-limit";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middleware/auth.middleware";
import { CollectionController } from "./collection.controller";

const router = express.Router();

const ALL_AUTH = [
  ENUM_USER_ROLE.USER,
  ENUM_USER_ROLE.WRITER,
  ENUM_USER_ROLE.ADMIN,
  ENUM_USER_ROLE.SUPER_ADMIN,
] as const;

const collectionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/",
  collectionLimiter,
  auth(...ALL_AUTH),
  CollectionController.createCollection
);

router.patch(
  "/:id",
  collectionLimiter,
  auth(...ALL_AUTH),
  CollectionController.updateCollection
);

router.post(
  "/:id/stories",
  collectionLimiter,
  auth(...ALL_AUTH),
  CollectionController.addStoryToCollection
);

router.delete(
  "/:id/stories/:storyId",
  collectionLimiter,
  auth(...ALL_AUTH),
  CollectionController.removeStoryFromCollection
);

router.delete(
  "/:id",
  collectionLimiter,
  auth(...ALL_AUTH),
  CollectionController.deleteCollection
);

router.get("/:id", CollectionController.getCollectionById);
router.get("/user/:userId", CollectionController.getUserCollections);

export const CollectionRouter = router;
