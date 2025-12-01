import { apiClient } from './api';

export interface YouTubeShort {
  id: number;
  profile_id: number;
  video_id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  published_at: string;
  created_at: string;
  profile_name: string;
  profile_image: string | null;
  profile_insight: string | null;
  category_name: string;
  subcategory_name: string | null;
  tags: Array<{
    id: number;
    name: string;
    type: string;
  }> | null;
}

export interface ShortsFilters {
  category?: number;
  subcategory?: number;
  tags?: number[];
  limit?: number;
  offset?: number;
  orderBy?: 'published_at' | 'created_at' | 'duration';
}

export interface ShortsResponse {
  success: boolean;
  data: YouTubeShort[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const youtubeApi = {
  /**
   * Get YouTube Shorts with filters
   */
  async getShorts(filters?: ShortsFilters): Promise<ShortsResponse> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.category) params.append('category', filters.category.toString());
      if (filters.subcategory) params.append('subcategory', filters.subcategory.toString());
      if (filters.tags?.length) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
    }

    const response = await apiClient.get(`/youtube/shorts?${params.toString()}`);
    return response.data;
  },

  /**
   * Get Shorts for a specific profile
   */
  async getShortsByProfile(profileId: number): Promise<ShortsResponse> {
    const response = await apiClient.get(`/youtube/profile/${profileId}`);
    return response.data;
  },

  /**
   * Get YouTube embed URL for a video
   */
  getEmbedUrl(videoId: string, autoplay: boolean = false): string {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      autohide: '1',
      showinfo: '0',
      controls: '1'
    });

    if (autoplay) {
      params.append('autoplay', '1');
      params.append('mute', '1'); // Auto-play requires mute
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  },

  /**
   * Format duration in seconds to readable format
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  }
};

export default youtubeApi;
