import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesApi } from '@/lib/favoritesApi';

const MAX_GUEST_FAVORITES = 5;
const STORAGE_KEY = 'guest_favorites';

export interface FavoriteProfile {
  id: number;
  name: string;
  category_name: string;
  image_url: string | null;
  insight: string | null;
}

export const useFavorites = () => {
  const { isAuthenticated, token } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated, token]);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      if (isAuthenticated && token) {
        // Load from database for authenticated users
        const response = await favoritesApi.getAll(token);
        const favoriteIds: number[] = [];
        Object.values(response.data).forEach(categoryGroup => {
          categoryGroup.profiles.forEach(profile => favoriteIds.push(profile.id));
        });
        setFavorites(favoriteIds);
      } else {
        // Load from session storage for guests
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = useCallback(async (profileId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      if (isAuthenticated && token) {
        // Add to database for authenticated users
        const response = await favoritesApi.add(profileId, token);

        if (response.success) {
          setFavorites(prev => [...prev, profileId]);
          return { success: true };
        }

        return { success: false, message: 'Failed to add favorite' };
      } else {
        // Add to session storage for guests (max 5)
        if (favorites.length >= MAX_GUEST_FAVORITES) {
          setShowUpgradePrompt(true);
          return {
            success: false,
            message: `You've reached the limit of ${MAX_GUEST_FAVORITES} favorites. Create an account to save unlimited favorites!`
          };
        }

        if (favorites.includes(profileId)) {
          return { success: false, message: 'Already in favorites' };
        }

        const newFavorites = [...favorites, profileId];
        setFavorites(newFavorites);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));

        // Show upgrade prompt if they've added 5 favorites
        if (newFavorites.length >= MAX_GUEST_FAVORITES) {
          setShowUpgradePrompt(true);
        }

        return { success: true };
      }
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to add favorite'
      };
    }
  }, [isAuthenticated, token, favorites]);

  const removeFavorite = useCallback(async (profileId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      if (isAuthenticated && token) {
        // Remove from database
        await favoritesApi.remove(profileId, token);
        setFavorites(prev => prev.filter(id => id !== profileId));
        return { success: true };
      } else {
        // Remove from session storage
        const newFavorites = favorites.filter(id => id !== profileId);
        setFavorites(newFavorites);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
        return { success: true };
      }
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to remove favorite'
      };
    }
  }, [isAuthenticated, token, favorites]);

  const isFavorite = useCallback((profileId: number): boolean => {
    return favorites.includes(profileId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (profileId: number): Promise<{ success: boolean; message?: string }> => {
    if (isFavorite(profileId)) {
      return await removeFavorite(profileId);
    } else {
      return await addFavorite(profileId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const getFavoriteCount = useCallback((): number => {
    return favorites.length;
  }, [favorites]);

  const canAddMore = useCallback((): boolean => {
    if (isAuthenticated) {
      return true; // Unlimited for authenticated users
    }
    return favorites.length < MAX_GUEST_FAVORITES;
  }, [isAuthenticated, favorites]);

  const dismissUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoriteCount,
    canAddMore,
    showUpgradePrompt,
    dismissUpgradePrompt,
    maxGuestFavorites: MAX_GUEST_FAVORITES
  };
};
