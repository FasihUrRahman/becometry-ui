import { apiClient } from './api';

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  subcategories?: Category[];
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export const categoryApi = {
  /**
   * Get all categories and subcategories
   */
  async getAll(): Promise<CategoriesResponse> {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<{ success: boolean; data: Category }> {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Get subcategories for a parent category
   */
  async getSubcategories(categoryId: number): Promise<CategoriesResponse> {
    const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  }
};

export default categoryApi;
