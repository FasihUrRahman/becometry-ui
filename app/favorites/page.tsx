'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesApi, FavoriteProfile } from '@/lib/favoritesApi';
import ProfileCard from '@/components/ProfileCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();

  const [favorites, setFavorites] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group favorites by category
  const favoritesByCategory = favorites.reduce((acc, fav) => {
    const category = fav.category_name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(fav);
    return acc;
  }, {} as Record<string, FavoriteProfile[]>);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    fetchFavorites();
  }, [isAuthenticated, token]);

  const fetchFavorites = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await favoritesApi.getAll(token);
      // Convert grouped favorites to flat array
      const flatFavorites: FavoriteProfile[] = [];
      Object.values(response.data).forEach(categoryGroup => {
        flatFavorites.push(...categoryGroup.profiles);
      });
      setFavorites(flatFavorites);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-400 text-xl">Loading your favorites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-dark-100 mb-4">Error Loading Favorites</h1>
          <p className="text-dark-400 mb-6">{error}</p>
          <button
            onClick={fetchFavorites}
            className="px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Favorites</h1>
              <p className="text-dark-400">
                {user?.name && `Welcome back, ${user.name}! `}
                {favorites.length === 0
                  ? 'You haven\'t saved any profiles yet'
                  : `You have ${favorites.length} saved ${favorites.length === 1 ? 'profile' : 'profiles'}`
                }
              </p>
            </div>

            <Link
              href="/explore"
              className="px-6 py-3 glass-effect border border-dark-700 text-dark-300 rounded-xl font-semibold hover:bg-dark-800 hover:text-accent-purple transition-all"
            >
              Explore Profiles
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="glass-effect rounded-3xl p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-purple/30 to-accent-blue/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">No Favorites Yet</h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Start exploring profiles and click the heart icon to save your favorites.
              You can save unlimited profiles with your account!
            </p>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              Explore Profiles
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          /* Favorites Grid by Category */
          <div className="space-y-12">
            {Object.entries(favoritesByCategory).map(([category, categoryFavorites]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">{category}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-dark-700 to-transparent"></div>
                  <span className="text-dark-500 text-sm font-semibold">
                    {categoryFavorites.length} {categoryFavorites.length === 1 ? 'profile' : 'profiles'}
                  </span>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryFavorites.map((favorite) => (
                    <ProfileCard
                      key={favorite.id}
                      id={favorite.id}
                      name={favorite.name}
                      category={favorite.category_name}
                      image_url={favorite.image_url}
                      insight={favorite.insight}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
