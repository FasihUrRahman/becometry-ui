'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { youtubeApi, YouTubeShort, ShortsFilters } from '@/lib/youtubeApi';
import { categoryApi } from '@/lib/categoryApi';
import { tagApi } from '@/lib/tagApi';
import Script from 'next/script';
import './youtube-hide.css';

// Declare YouTube Player API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Dummy data for preview
const DUMMY_SHORTS: YouTubeShort[] = [
  {
    id: 1,
    video_id: 'dQw4w9WgXcQ',
    title: 'How to Build a Successful Business in 60 Seconds',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 60,
    published_at: '2024-01-15T10:00:00Z',
    profile_id: 1,
    expert_name: 'Gary Vaynerchuk',
    category_name: 'Business',
    subcategory_name: 'Entrepreneurship',
    tags: [
      { id: 1, name: 'Startup' },
      { id: 2, name: 'Motivation' },
      { id: 3, name: 'Success' }
    ]
  },
  {
    id: 2,
    video_id: 'jNQXAC9IVRw',
    title: '3 Coding Tips Every Developer Should Know',
    thumbnail_url: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: 45,
    published_at: '2024-01-14T15:30:00Z',
    profile_id: 2,
    expert_name: 'Fireship',
    category_name: 'Technology',
    subcategory_name: 'Programming',
    tags: [
      { id: 4, name: 'JavaScript' },
      { id: 5, name: 'Tutorial' },
      { id: 6, name: 'Web Development' }
    ]
  },
  {
    id: 3,
    video_id: 'kJQP7kiw5Fk',
    title: 'Morning Routine for Peak Performance',
    thumbnail_url: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    duration: 58,
    published_at: '2024-01-13T08:00:00Z',
    profile_id: 3,
    expert_name: 'Andrew Huberman',
    category_name: 'Health',
    subcategory_name: 'Wellness',
    tags: [
      { id: 7, name: 'Productivity' },
      { id: 8, name: 'Health' },
      { id: 9, name: 'Science' }
    ]
  }
];

export default function ShortsPage() {
  const [shorts, setShorts] = useState<YouTubeShort[]>(DUMMY_SHORTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Filters
  const [filters, setFilters] = useState<ShortsFilters>({
    limit: 10,
    offset: 0,
    orderBy: 'published_at'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<{ [key: number]: any }>({});
  const playerDivRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Initialize YouTube IFrame API
  useEffect(() => {
    // Set up YouTube API ready callback
    window.onYouTubeIframeAPIReady = () => {
      setYtReady(true);
    };

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setYtReady(true);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchShorts();
    fetchFilterOptions();
  }, []);

  // Fetch filter options (categories, tags)
  const fetchFilterOptions = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoryApi.getAll(),
        tagApi.getAll()
      ]);
      setCategories(categoriesData.data);
      setTags(tagsData.data);
    } catch (err: any) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Fetch shorts
  const fetchShorts = async (reset: boolean = false) => {
    try {
      setLoading(true);
      const currentFilters = reset ? { ...filters, offset: 0 } : filters;
      const response = await youtubeApi.getShorts(currentFilters);

      // Check if response is valid
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      if (reset) {
        setShorts(response.data);
        setCurrentIndex(0);
      } else {
        setShorts(prev => [...prev, ...response.data]);
      }

      setHasMore(response.pagination?.hasMore ?? false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load Shorts');
      console.error('Error fetching shorts:', err);
      setShorts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Create YouTube players when API is ready and shorts are loaded
  useEffect(() => {
    if (!ytReady || shorts.length === 0) return;

    shorts.forEach((short, index) => {
      const divId = `player-${index}`;
      const divElement = playerDivRefs.current[index];

      if (divElement && !playerRefs.current[index]) {
        try {
          playerRefs.current[index] = new window.YT.Player(divId, {
            videoId: short.video_id,
            playerVars: {
              autoplay: index === currentIndex ? 1 : 0,
              controls: 0, // Hide default controls
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              fs: 0,
              playsinline: 1,
              loop: 1,
              playlist: short.video_id,
              iv_load_policy: 3, // Hide annotations
              disablekb: 1, // Disable keyboard controls
              cc_load_policy: 0 // Hide captions by default
            },
            events: {
              onReady: (event: any) => {
                if (index === currentIndex) {
                  event.target.playVideo();
                  event.target.setVolume(100);
                }
              }
            }
          });
        } catch (error) {
          console.error('Error creating player:', error);
        }
      }
    });
  }, [ytReady, shorts, currentIndex]);

  // Handle video playback when scrolling
  useEffect(() => {
    Object.keys(playerRefs.current).forEach((key) => {
      const index = parseInt(key);
      const player = playerRefs.current[index];

      if (player && typeof player.pauseVideo === 'function' && typeof player.playVideo === 'function') {
        try {
          if (index === currentIndex) {
            player.playVideo();
            setIsPlaying(true);
          } else {
            player.pauseVideo();
          }
        } catch (error) {
          console.error('Error controlling video playback:', error);
        }
      }
    });
  }, [currentIndex]);

  // Handle scroll to change video
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / videoHeight);

    if (newIndex !== currentIndex && newIndex < shorts.length) {
      setCurrentIndex(newIndex);

      // Load more when near the end
      if (newIndex >= shorts.length - 2 && hasMore && !loading) {
        setFilters(prev => ({ ...prev, offset: prev.offset! + prev.limit! }));
        fetchShorts();
      }
    }
  }, [currentIndex, shorts.length, hasMore, loading]);

  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Apply filters
  const applyFilters = () => {
    setFilters({ ...filters, offset: 0 });
    fetchShorts(true);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      limit: 10,
      offset: 0,
      orderBy: 'published_at'
    });
    fetchShorts(true);
    setShowFilters(false);
  };

  // Custom control functions
  const togglePlayPause = () => {
    const player = playerRefs.current[currentIndex];
    if (!player || typeof player.pauseVideo !== 'function') return;

    try {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
      } else {
        player.playVideo();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const toggleMute = () => {
    const player = playerRefs.current[currentIndex];
    if (!player || typeof player.mute !== 'function') return;

    try {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  if (error && shorts.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-dark-100 mb-4">Error Loading Shorts</h1>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (loading && shorts.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-400 text-xl">Loading Shorts...</div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold text-dark-100 mb-4">No Shorts Available</h1>
          <p className="text-dark-400 mb-6">
            No YouTube Shorts have been extracted yet. Check back later!
          </p>
          <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all">
            Explore Profiles
          </Link>
        </div>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];

  return (
    <>
      {/* Load YouTube IFrame API */}
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.YT && window.YT.Player) {
            setYtReady(true);
          }
        }}
      />

      <div className="relative w-screen h-screen bg-black overflow-hidden">
        {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/explore" className="text-white hover:text-accent-purple transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <h1 className="text-white text-xl font-bold">Shorts</h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-white hover:text-accent-purple transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/90 backdrop-blur-lg overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-400 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-purple"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-400 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto glass-effect rounded-xl p-4">
                {tags.slice(0, 30).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      const tagIds = filters.tags || [];
                      const isSelected = tagIds.includes(tag.id);
                      setFilters({
                        ...filters,
                        tags: isSelected
                          ? tagIds.filter(id => id !== tag.id)
                          : [...tagIds, tag.id]
                      });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      (filters.tags || []).includes(tag.id)
                        ? 'bg-accent-purple text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-400 mb-2">Sort By</label>
              <select
                value={filters.orderBy || 'published_at'}
                onChange={(e) => setFilters({ ...filters, orderBy: e.target.value as any })}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-accent-purple"
              >
                <option value="published_at">Latest Published</option>
                <option value="created_at">Recently Added</option>
                <option value="duration">Shortest First</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={applyFilters}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-3 glass-effect border border-dark-700 text-dark-300 rounded-xl font-semibold hover:bg-dark-800 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Scrolling Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {shorts.map((short, index) => (
          <div key={`${short.id}-${index}`} className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black">
            {/* YouTube Player - Scale up to hide controls */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                id={`player-${index}`}
                ref={el => { playerDivRefs.current[index] = el; }}
                className="w-full h-full youtube-player-wrapper"
                style={{
                  transform: 'scale(1.1)',
                  transformOrigin: 'center center'
                }}
              />
            </div>

            {/* Overlay to block YouTube UI interactions */}
            <div className="absolute inset-0 z-10 bg-transparent" />

            {/* Play/Pause Tap Area - Only for current video */}
            {index === currentIndex && (
              <div
                className="absolute inset-0 z-20"
                onClick={togglePlayPause}
              >
                {/* Play/Pause Icon - Shows briefly when tapped */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mute Button - Top Right */}
            {index === currentIndex && (
              <button
                onClick={toggleMute}
                className="absolute top-20 right-6 z-30 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            )}

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 z-30 pointer-events-none">
              <div className="pointer-events-auto">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Video & Profile Info */}
                <div className="flex-1">
                  <h2 className="text-white text-lg font-bold mb-2 line-clamp-2">{short.title}</h2>

                  <Link href={`/profile/${short.profile_id}`} className="flex items-center gap-3 mb-3 group">
                    {short.profile_image ? (
                      <img src={short.profile_image} alt={short.expert_name || 'Expert'} className="w-10 h-10 rounded-full border-2 border-white/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{short.expert_name?.charAt(0) || 'E'}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold group-hover:text-accent-purple transition-colors">{short.expert_name || 'Expert'}</p>
                      <p className="text-dark-400 text-sm">{short.category_name || 'Uncategorized'}</p>
                    </div>
                  </Link>

                  {/* Tags */}
                  {short.tags && short.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {short.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-dark-400 text-sm">
                    {youtubeApi.formatDuration(short.duration)} • {new Date(short.published_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-col gap-4">
                  <Link
                    href={`/profile/${short.profile_id}`}
                    className="flex flex-col items-center gap-1 text-white hover:text-accent-purple transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs">Profile</span>
                  </Link>

                  <button className="flex flex-col items-center gap-1 text-white hover:text-red-500 transition-colors">
                    <div className="w-12 h-12 rounded-full glass-effect flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-xs">Save</span>
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator at the end */}
        {loading && hasMore && (
          <div className="w-full h-screen flex items-center justify-center bg-black">
            <div className="text-white text-xl">Loading more...</div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {shorts.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex % 5 ? 'bg-white h-6' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

        {/* Hide scrollbar */}
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
}
