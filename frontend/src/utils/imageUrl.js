import { API_BASE_URL } from "../services/api";

/**
 * Normalizes image URLs to handle both local relative paths 
 * and absolute Cloudinary/external URLs.
 * 
 * @param {string} path - The image path or URL
 * @returns {string} - The full usable URL
 */
export const getImageUrl = (path) => {
  if (!path) return "";
  
  // If it's already a full URL (starts with http), return it as is
  if (path.startsWith("http")) {
    return path;
  }
  
  // Otherwise, prefix it with the API base URL
  // Ensure we don't have double slashes if the path starts with /
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${sanitizedPath}`;
};
