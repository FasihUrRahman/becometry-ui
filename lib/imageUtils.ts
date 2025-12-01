/**
 * Get the full image URL from a relative or absolute path
 * @param imageUrl - The image URL from the API (could be relative like /uploads/... or absolute)
 * @returns Full URL to the image
 */
export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return '/placeholder-profile.jpg'; // Default placeholder
  }

  // If it's already a full URL (starts with http), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a local path starting with /uploads/, serve from backend
  if (imageUrl.startsWith('/uploads/')) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    // Remove /api from the end since uploads are served from root
    const backendUrl = apiBaseUrl.replace('/api', '');
    return `${backendUrl}${imageUrl}`;
  }

  // If it's a default avatar or other local asset, return as-is
  return imageUrl;
}
