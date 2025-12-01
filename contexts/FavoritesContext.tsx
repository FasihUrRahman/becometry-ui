'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritesApi, GroupedFavorites } from '@/lib/favoritesApi';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface FavoritesContextType {
  favorites: GroupedFavorites;
  favoritesCount: number;
  sessionId: string;
  addFavorite: (profileId: number) => Promise<{ success: boolean; needsAccount?: boolean }>;
  removeFavorite: (profileId: number) => Promise<void>;
  isFavorited: (profileId: number) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
  showCTA: boolean;
  setShowCTA: (show: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<GroupedFavorites>({});
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [showCTA, setShowCTA] = useState(false);

  // Initialize or load session ID
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Load favorites and count
  const refreshFavorites = useCallback(async () => {
    if (!sessionId && !token) return;

    try {
      const [favoritesData, countData] = await Promise.all([
        favoritesApi.getAll(token, sessionId),
        favoritesApi.count(token, sessionId)
      ]);

      setFavorites(favoritesData.data);
      setFavoritesCount(countData.data.count);
    } catch (error) {
      // Silently handle error when backend is not available
    }
  }, [token, sessionId]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const addFavorite = async (profileId: number) => {
    try {
      const response = await favoritesApi.add(profileId, token, sessionId);

      if (response.needsAccount) {
        setShowCTA(true);
        return { success: false, needsAccount: true };
      }

      // Update session ID if returned (for anonymous users)
      if (response.sessionId) {
        localStorage.setItem('sessionId', response.sessionId);
        setSessionId(response.sessionId);
      }

      await refreshFavorites();

      // Show CTA if user hit 5 favorites without account
      if (!isAuthenticated && favoritesCount >= 4) {
        setShowCTA(true);
      }

      return { success: true };
    } catch (error: any) {
      if (error.response?.data?.needsAccount) {
        setShowCTA(true);
        return { success: false, needsAccount: true };
      }
      throw error;
    }
  };

  const removeFavorite = async (profileId: number) => {
    await favoritesApi.remove(profileId, token, sessionId);
    await refreshFavorites();
  };

  const isFavorited = async (profileId: number): Promise<boolean> => {
    try {
      const response = await favoritesApi.check(profileId, token, sessionId);
      return response.data.isFavorited;
    } catch (error) {
      return false;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount,
        sessionId,
        addFavorite,
        removeFavorite,
        isFavorited,
        refreshFavorites,
        showCTA,
        setShowCTA
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
