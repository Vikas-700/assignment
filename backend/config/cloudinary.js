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
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "stories",      // optional: organize files
      width: 400,             // portrait width
      height: 700,            // portrait height
      crop: "fill",           // crop to fill frame
      gravity: "auto"         // auto-center important part
    });

    fs.unlinkSync(filePath);  // remove temp file
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

export default uploadOnCloudinary;
