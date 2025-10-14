import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  animation: String
});

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  slides: [slideSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Story", storySchema);
