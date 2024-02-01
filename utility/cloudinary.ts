import cloudinary, { UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Function to upload an image to Cloudinary
export const uploadToCloudinary = (imageBuffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        { folder: "user_images" }, // This folder is create at cloudinary and store your uploaded files
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      )
      .end(imageBuffer);
  });
};
