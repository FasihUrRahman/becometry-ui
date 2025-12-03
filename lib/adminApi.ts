const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class AdminAPI {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('adminToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
  }

  getToken() {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth
  async login(username: string, password: string) {
    const data = await this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async verify() {
    return this.request('/admin/auth/verify');
  }

  logout() {
    this.clearToken();
  }

  // Categories
  async getCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(name: string) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateCategory(id: number, name: string) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCategory(id: number) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Subcategories
  async getSubcategories(categoryId?: number) {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    return this.request(`/admin/subcategories${query}`);
  }

  async createSubcategory(name: string, categoryId: number) {
    return this.request('/admin/subcategories', {
      method: 'POST',
      body: JSON.stringify({ name, category_id: categoryId }),
    });
  }

  async updateSubcategory(id: number, name: string, categoryId: number) {
    return this.request(`/admin/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, category_id: categoryId }),
    });
  }

  async deleteSubcategory(id: number) {
    return this.request(`/admin/subcategories/${id}`, {
      method: 'DELETE',
    });
  }

  // Profiles
  async getProfiles(params?: { page?: number; limit?: number; status?: string; category_id?: number; search?: string }) {
    // Filter out undefined values
    const cleanParams: any = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }
    const query = new URLSearchParams(cleanParams).toString();
    return this.request(`/admin/profiles?${query}`);
  }

  async createProfile(profile: any) {
    return this.request('/admin/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateProfile(id: number, profile: any) {
    return this.request(`/admin/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async deleteProfile(id: number) {
    return this.request(`/admin/profiles/${id}`, {
      method: 'DELETE',
    });
  }

  // Stats
  async getStats() {
    return this.request('/admin/stats');
  }

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/admin/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data;
  }
}

export const adminApi = new AdminAPI();
