import mongoose from "mongoose";

// Comment schema (for each slide)
const commentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username or userId
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Slide schema — now each slide has its own likes, comments, and views
const slideSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  animation: String,
  likes: [{ type: String }], // store user IDs who liked this slide
  comments: [commentSchema],
  views: { type: Number, default: 0 },
});

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  slides: [slideSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Story", storySchema);
