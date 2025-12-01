'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteButtonProps {
  profileId: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ profileId, size = 'md' }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    const checkFavorited = async () => {
      const result = await isFavorited(profileId);
      setFavorited(result);
    };
    checkFavorited();
  }, [profileId, isFavorited]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;

    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(profileId);
        setFavorited(false);
      } else {
        const result = await addFavorite(profileId);
        if (result.success) {
          setFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full glass-effect border border-dark-700 hover:border-accent-purple transition-all group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? (
        <svg className={`${iconSizes[size]} text-accent-purple`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className={`${iconSizes[size]} text-dark-400 group-hover:text-accent-purple`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
}
