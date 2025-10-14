import express from "express";
import {upload} from "../middleware/multer.js";               // <-- Import your Multer config
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStory);

// Use Multer middleware for POST and PUT, matching 'slides' to input field name
router.post("/", upload.array("slides"), createStory);
router.put("/:id", upload.array("slides"), updateStory);

router.delete("/:id", deleteStory);

export default router;
