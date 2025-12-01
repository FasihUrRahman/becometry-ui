import { apiClient } from './api';
import { ProfilesResponse, ProfileResponse } from '../types/api';
import { ProfileFilters, ProfileCard } from '../types/profile';

export const profileApi = {
  // Get all profiles with filters
  async getProfiles(filters?: any): Promise<ProfilesResponse> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.category_id) params.append('category_id', filters.category_id.toString());
      if (filters.subcategory_ids?.length) {
        params.append('subcategory_ids', filters.subcategory_ids.join(','));
      }
      if (filters.tag_ids?.length) {
        params.append('tag_ids', filters.tag_ids.join(','));
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.has_image !== undefined) params.append('has_image', filters.has_image.toString());
      if (filters.countries) params.append('countries', filters.countries);
      if (filters.languages) params.append('languages', filters.languages);
      if (filters.platforms) params.append('platforms', filters.platforms);
    }

    const response = await apiClient.get(`/profiles?${params.toString()}`);
    return response.data;
  },

  // Get profile by ID
  async getProfileById(id: number): Promise<ProfileResponse> {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  // Get related profiles
  async getRelatedProfiles(id: number, limit: number = 6): Promise<{ success: boolean; data: ProfileCard[] }> {
    const response = await apiClient.get(`/profiles/${id}/related?limit=${limit}`);
    return response.data;
  },

  // Get recent profiles
  async getRecentProfiles(limit: number = 10): Promise<{ success: boolean; data: ProfileCard[] }> {
    const response = await apiClient.get(`/profiles/recent?limit=${limit}`);
    return response.data;
  },
};
