const cloudinary = require("cloudinary").v2;

// Configure with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error("filePath is required");

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading to Cloudinary");
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error("publicId is required");

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted:", result);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete asset from Cloudinary");
  }
};

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
