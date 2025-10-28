import express from "express";
import { upload } from "../middleware/multer.js";
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
  likeSlide,
  commentOnSlide,
  incrementSlideView
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStory);
router.post("/", upload.array("slides"), createStory);
router.put("/:id", upload.array("slides"), updateStory);
router.delete("/:id", deleteStory);

// 🔥 Slide-level routes
router.post("/:id/slides/:slideIndex/like", likeSlide);
router.post("/:id/slides/:slideIndex/comment", commentOnSlide);
router.post("/:id/slides/:slideIndex/view", incrementSlideView);

export default router;
