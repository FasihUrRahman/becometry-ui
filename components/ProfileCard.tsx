import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import { getImageUrl } from '@/lib/imageUtils';

interface ProfileCardProps {
  id: number;
  name: string;
  category: string;
  image_url?: string;
  insight?: string;
}

export default function ProfileCard({ id, name, category, image_url, insight }: ProfileCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const favorited = isFavorite(id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);

    try {
      await toggleFavorite(id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Link href={`/profile/${id}`}>
      <div className="group relative h-full">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Card */}
        <div className="relative glass-effect rounded-2xl overflow-hidden card-hover h-full flex flex-col shadow-card">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-dark-900">
            {image_url ? (
              <Image
                src={getImageUrl(image_url)}
                alt={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-purple/30 to-accent-blue/30 flex items-center justify-center">
                <svg className="w-20 h-20 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60" />

            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-dark-900/80 backdrop-blur-md border border-dark-700 rounded-full text-xs font-semibold text-accent-purple">
                {category}
              </span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              disabled={isToggling}
              className="absolute top-4 left-4 w-10 h-10 bg-dark-900/80 backdrop-blur-md border border-dark-700 rounded-full flex items-center justify-center hover:scale-110 transition-all disabled:opacity-50"
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  favorited ? 'text-red-500 fill-current' : 'text-dark-400'
                }`}
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-purple transition-colors line-clamp-1">
              {name}
            </h3>

            {insight && (
              <p className="text-dark-400 text-sm leading-relaxed line-clamp-2 flex-1">
                {insight}
              </p>
            )}

            {/* View Profile Arrow */}
            <div className="mt-4 flex items-center text-accent-purple font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
              <span>View Profile</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
