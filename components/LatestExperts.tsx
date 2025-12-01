'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { profileApi } from '@/lib/profileApi';
import ProfileCard from './ProfileCard';

interface LatestExpertsProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function LatestExperts({ limit = 10, showViewAll = true }: LatestExpertsProps) {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecentProfiles();
  }, []);

  const fetchRecentProfiles = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getRecentProfiles(limit);
      setProfiles(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load recent experts');
      console.error('Error fetching recent profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-3xl p-8 border border-dark-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Latest Experts</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-dark-400">Loading recent experts...</div>
        </div>
      </div>
    );
  }

  if (error || profiles.length === 0) {
    return null; // Don't show section if no recent profiles
  }

  if (isCollapsed) {
    return (
      <div className="glass-effect rounded-3xl p-6 border border-dark-800 hover:border-dark-700 transition-all cursor-pointer" onClick={() => setIsCollapsed(false)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Latest Experts</h3>
              <p className="text-sm text-dark-400">{profiles.length} new profiles added recently</p>
            </div>
          </div>
          <svg className="w-6 h-6 text-dark-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-3xl p-8 border border-dark-800 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-glow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">Latest Experts</h2>
            <p className="text-sm text-dark-400">Added in the last 48 hours</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showViewAll && (
            <Link
              href="/explore?sort=recent"
              className="px-4 py-2 glass-effect border border-dark-700 text-dark-300 rounded-xl text-sm font-semibold hover:bg-dark-800 hover:text-accent-purple transition-all"
            >
              View All
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 glass-effect border border-dark-700 text-dark-400 rounded-xl hover:text-accent-purple hover:bg-dark-800 transition-all"
            title="Collapse section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-dark-900/90 backdrop-blur-sm border border-dark-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-dark-800 hover:scale-110 transition-all shadow-lg -ml-5"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {profiles.map((profile) => (
            <div key={profile.id} className="flex-shrink-0 w-80">
              <ProfileCard
                id={profile.id}
                name={profile.name}
                category={profile.category_name}
                image_url={profile.image_url}
                insight={profile.insight}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-dark-900/90 backdrop-blur-sm border border-dark-700 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-dark-800 hover:scale-110 transition-all shadow-lg -mr-5"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Badge showing number of new profiles */}
      <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-full text-xs font-bold shadow-glow">
        {profiles.length} New
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
