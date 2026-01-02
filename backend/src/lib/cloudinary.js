import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

cloudinary.config({
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
  cloud_name: ENV.CLOUD_NAME,
});
export const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "groups",
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.log(error.message);
  }
};
