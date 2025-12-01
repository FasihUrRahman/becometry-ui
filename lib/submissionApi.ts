import { apiClient } from './api';

export interface SubmissionData {
  name: string;
  email: string;
  category: string;
  bio: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
}

export interface Submission {
  id: number;
  submission_type: string;
  name: string;
  email: string;
  category_id: number;
  subcategory_id?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  category_name?: string;
  subcategory_name?: string;
  social_links?: Array<{ platform: string; url: string }>;
}

export const submissionApi = {
  // Submit application
  async create(data: SubmissionData): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await apiClient.post('/api/submissions', data);
    return response.data;
  },

  // Get all submissions (admin)
  async getAll(filters?: { page?: number; limit?: number; status?: string }): Promise<{
    success: boolean;
    data: Submission[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get(`/api/submissions?${params.toString()}`);
    return response.data;
  },

  // Update submission status (admin)
  async updateStatus(id: number, status: string, admin_notes?: string): Promise<{ success: boolean; data: Submission }> {
    const response = await apiClient.put(`/api/submissions/${id}/status`, { status, admin_notes });
    return response.data;
  },
};
