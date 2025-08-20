/**
 * Utility functions for handling images, including base64 conversion
 */

/**
 * Formats an image URL to handle different formats (base64, regular URLs)
 * @param {string} imageUrl - The image URL to format
 * @returns {string|null} - Formatted image URL or null if invalid
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  console.log('Processing image URL:', imageUrl.substring(0, 100) + '...'); // Debug log
  
  // If it's already a complete URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's already a complete base64 data URI, return as is
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  // If it contains base64 but doesn't have proper prefix
  if (imageUrl.includes('base64')) {
    // Extract just the base64 part after 'base64,'
    const base64Match = imageUrl.match(/base64,(.+)/);
    if (base64Match) {
      return `data:image/jpeg;base64,${base64Match[1]}`;
    }
  }
  
  // If it's just a base64 string (starts with / or letters/numbers)
  if (imageUrl.startsWith('/9j/') || /^[A-Za-z0-9+/]/.test(imageUrl)) {
    try {
      // Check if it looks like a base64 string
      if (imageUrl.length > 50 && imageUrl.length % 4 === 0) {
        return `data:image/jpeg;base64,${imageUrl}`;
      }
    } catch (e) {
      console.error('Error processing base64 image:', e);
    }
  }
  
  return imageUrl;
};

/**
 * Converts a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise that resolves to base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validates if a string is a valid base64
 * @param {string} str - String to validate
 * @returns {boolean} - True if valid base64
 */
export const isValidBase64 = (str) => {
  if (!str) return false;
  
  try {
    // Remove data URI prefix if present
    const base64String = str.replace(/^data:image\/[a-zA-Z]*;base64,/, '');
    
    // Check if it's valid base64
    return base64String.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(base64String);
  } catch (e) {
    return false;
  }
};

/**
 * Gets the fallback image URL for when images fail to load
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @param {string} text - Text to display on placeholder
 * @returns {string} - Placeholder image URL
 */
export const getFallbackImage = (width = 100, height = 100, text = 'No+Image') => {
  return `https://via.placeholder.com/${width}x${height}/fff5f0/ff8c00?text=${text}`;
};
