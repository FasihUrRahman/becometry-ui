import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export const authApi = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      name
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  async getMe(token: string): Promise<{ success: boolean; data: User }> {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
