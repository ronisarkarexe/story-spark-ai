import express from "express";
import { TagController } from "./tag.controller";
import auth from "../../middleware/auth.middleware";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get("/popular", TagController.getPopularTags);
router.post("/suggest", TagController.suggestTags);

// Recommendations based on shared tags
router.get("/recommendations/:storyId", TagController.getRecommendations);

// Modify/delete tags globally requires authentication
router.patch(
  "/rename",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  TagController.renameTag
);

router.delete(
  "/:tag",
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.WRITER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  TagController.deleteTag
);

export const TagRouter = router;
