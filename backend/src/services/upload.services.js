/**
 * Upload Service
 * This service abstracts file upload logic.
 * Currently assumes files are already uploaded (URL-based),
 * but can be extended to Cloudinary / S3 later.
 */

/* -------------------- UPLOAD FILE -------------------- */
exports.uploadFile = async (fileData) => {
  /*
    fileData example:
    {
      url: "https://cloudinary.com/xyz",
      type: "image" | "video"
    }
  */

  if (!fileData || !fileData.url) {
    throw new Error("Invalid file data");
  }

  return {
    url: fileData.url,
    mediaType: fileData.type,
  };
};

/* -------------------- DELETE FILE -------------------- */
exports.deleteFile = async (fileUrl) => {
  /*
    Future implementation:
    - Cloudinary delete
    - S3 delete
  */

  if (!fileUrl) {
    throw new Error("File URL is required for deletion");
  }

  return true;
};
