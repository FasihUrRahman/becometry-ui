import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface FavoriteProfile {
  id: number;
  name: string;
  image_url: string;
  insight: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  subcategory_name: string;
  favorited_at: string;
}

export interface GroupedFavorites {
  [categoryName: string]: {
    category_id: number;
    category_slug: string;
    profiles: FavoriteProfile[];
  };
}

const getHeaders = (token?: string | null, sessionId?: string | null) => {
  const headers: any = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }
  return headers;
};

export const favoritesApi = {
  async getAll(token?: string | null, sessionId?: string | null): Promise<{ success: boolean; data: GroupedFavorites }> {
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: getHeaders(token, sessionId)
    });
    return response.data;
  },

  async add(profileId: number, token?: string | null, sessionId?: string | null) {
    const response = await axios.post(`${API_URL}/favorites/${profileId}`, {}, {
      headers: getHeaders(token, sessionId)
    });
    return response.data;
  },

  async remove(profileId: number, token?: string | null, sessionId?: string | null) {
    const response = await axios.delete(`${API_URL}/favorites/${profileId}`, {
      headers: getHeaders(token, sessionId)
    });
    return response.data;
  },

  async count(token?: string | null, sessionId?: string | null): Promise<{ success: boolean; data: { count: number; hasAccount: boolean; limit: number | null } }> {
    const response = await axios.get(`${API_URL}/favorites/count`, {
      headers: getHeaders(token, sessionId)
    });
    return response.data;
  },

  async check(profileId: number, token?: string | null, sessionId?: string | null): Promise<{ success: boolean; data: { isFavorited: boolean } }> {
    const response = await axios.get(`${API_URL}/favorites/check/${profileId}`, {
      headers: getHeaders(token, sessionId)
    });
    return response.data;
  },

  async transfer(token: string, sessionId: string) {
    const response = await axios.post(`${API_URL}/favorites/transfer`, 
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
