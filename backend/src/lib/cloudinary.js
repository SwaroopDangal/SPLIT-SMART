import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

cloudinary.config({
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
  cloud_name: ENV.CLOUD_NAME,
});

export const uploadMedia = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      })
      .end(buffer);
  });
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error.message);
  }
};
