import Story from "../models/sortyModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
//import cloudinary from "../config/cloudinary.js"; // Cloudinary setup file
import fs from "fs"; // to remove temporary uploaded files

// Get all stories
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single story
export const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    res.json(story);
  } catch (error) {
    res.status(404).json({ message: "Story not found" });
  }
};

// Create new story with Cloudinary upload


export const createStory = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedSlides = [];

    for (const file of req.files) {
      const url = await uploadOnCloudinary(file.path); // throws if Cloudinary fails
      uploadedSlides.push({ type: file.mimetype.startsWith("video") ? "video" : "image", url });
    }

    const story = await Story.create({
      title: req.body.title,
      category: req.body.category,
      slides: uploadedSlides,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error("Create Story Error:", error); // 🔹 log full error
    res.status(400).json({ message: error.message });
  }
};


// Update story
export const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Update title/category
    if (req.body.title) story.title = req.body.title;
    if (req.body.category) story.category = req.body.category;

    // Remove selected slides if IDs sent in body
    // req.body.removeSlides should be an array of slide _id
    if (req.body.removeSlides) {
      story.slides = story.slides.filter(
        (slide) => !req.body.removeSlides.includes(slide._id.toString())
      );
    }

    // Add new slides if uploaded
    if (req.files && req.files.length > 0) {
      const uploadedSlides = [];
      for (const file of req.files) {
        const url = await uploadOnCloudinary(file.path);
        uploadedSlides.push({
          type: file.mimetype.startsWith("video") ? "video" : "image",
          url,
          animation: req.body.animation || null,
        });
      }
      story.slides = [...story.slides, ...uploadedSlides];
    }

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Delete story
export const deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Like a specific slide
export const likeSlide = async (req, res) => {
  try {
    const { id, slideIndex } = req.params;
    const { userId } = req.body;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const slide = story.slides[slideIndex];
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    const hasLiked = slide.likes.includes(userId);
    if (hasLiked) {
      slide.likes = slide.likes.filter((u) => u !== userId);
    } else {
      slide.likes.push(userId);
    }

    await story.save();
    res.json({ likes: slide.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment on a specific slide
export const commentOnSlide = async (req, res) => {
  try {
    const { id, slideIndex } = req.params;
    const { user, text } = req.body;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const slide = story.slides[slideIndex];
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    slide.comments.push({ user, text });
    await story.save();
    res.json({ comments: slide.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment view count (one per request — frontend handles one view per user)
export const incrementSlideView = async (req, res) => {
  try {
    const { id, slideIndex } = req.params;
    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const slide = story.slides[slideIndex];
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    slide.views += 1;
    await story.save();
    res.json({ views: slide.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

