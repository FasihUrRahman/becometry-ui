import { apiClient } from './api';

export interface Tag {
  id: number;
  name: string;
  type: 'universal' | 'contextual';
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
}

export const tagApi = {
  /**
   * Get all tags
   */
  async getAll(type?: 'universal' | 'contextual'): Promise<TagsResponse> {
    const params = type ? { type } : {};
    const response = await apiClient.get('/tags', { params });
    return response.data;
  },

  /**
   * Get universal tags only
   */
  async getUniversal(): Promise<TagsResponse> {
    const response = await apiClient.get('/tags/universal');
    return response.data;
  },

  /**
   * Get contextual tags for a specific category
   */
  async getContextual(categoryId: number): Promise<TagsResponse> {
    const response = await apiClient.get(`/tags/contextual/${categoryId}`);
    return response.data;
  },

  /**
   * Get tag suggestions
   */
  async getSuggestions(): Promise<TagsResponse> {
    const response = await apiClient.get('/tags/suggestions');
    return response.data;
  }
};

export default tagApi;
