import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    // Check if file is video
    const isVideo = filePath.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    const uploadOptions = {
      resource_type: isVideo ? "video" : "image",
      folder: "stories",
    };

    // Apply transformations only for images
    if (!isVideo) {
      uploadOptions.width = 400;
      uploadOptions.height = 700;
      uploadOptions.crop = "fill";
      uploadOptions.gravity = "auto";
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    fs.unlinkSync(filePath); // remove temporary file after upload
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

export default uploadOnCloudinary;
