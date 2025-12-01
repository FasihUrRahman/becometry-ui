'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { profileApi } from '@/lib/profileApi';
import { Profile, ProfileCard } from '@/types/profile';
import { getImageUrl } from '@/lib/imageUtils';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [relatedProfiles, setRelatedProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [youtubeStats, setYoutubeStats] = useState({ videoCount: 0, subscriberCount: '0' });
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [carouselScrollPosition, setCarouselScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await profileApi.getProfileById(id);
        setProfile(profileData.data);

        // Fetch all profiles from the same category
        if (profileData.data.category_id) {
          const categoryProfiles = await profileApi.getProfiles({
            category_id: profileData.data.category_id,
            status: 'published',
            limit: 100
          });

          // Filter out the current profile
          const filteredProfiles = categoryProfiles.data.filter(
            (p: any) => p.id !== id
          );
          setRelatedProfiles(filteredProfiles);
        }

        // Fetch YouTube videos if profile has YouTube link
        if (profileData.data.social_links) {
          const youtubeLink = profileData.data.social_links.find(
            (link: any) => link.platform.toLowerCase() === 'youtube'
          );

          if (youtubeLink?.url) {
            await fetchYoutubeVideos(youtubeLink.url);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchYoutubeVideos = async (youtubeUrl: string) => {
    try {
      console.log('Fetching YouTube videos for URL:', youtubeUrl);

      // Extract channel ID or username from YouTube URL
      let channelId = '';
      let username = '';

      if (youtubeUrl.includes('youtube.com/channel/')) {
        channelId = youtubeUrl.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
      } else if (youtubeUrl.includes('youtube.com/@')) {
        username = youtubeUrl.split('youtube.com/@')[1].split('/')[0].split('?')[0];
      } else if (youtubeUrl.includes('youtube.com/c/')) {
        username = youtubeUrl.split('youtube.com/c/')[1].split('/')[0].split('?')[0];
      } else if (youtubeUrl.includes('youtube.com/user/')) {
        username = youtubeUrl.split('youtube.com/user/')[1].split('/')[0].split('?')[0];
      }

      console.log('Extracted - channelId:', channelId, 'username:', username);

      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyBigPkhZFC8aqrqy8D-Ql6269mLbR1E11M';

      // If we have username, get channel ID first
      if (username && !channelId) {
        console.log('Searching for channel with username:', username);
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();
        console.log('Channel search response:', searchData);

        if (searchData.items && searchData.items.length > 0) {
          channelId = searchData.items[0].snippet.channelId;
          console.log('Found channel ID:', channelId);
        }
      }

      if (!channelId) {
        console.error('Could not extract channel ID from YouTube URL');
        return;
      }

      // Fetch channel statistics
      console.log('Fetching channel statistics for:', channelId);
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
      );
      const channelData = await channelResponse.json();
      console.log('Channel data response:', channelData);

      if (channelData.items && channelData.items.length > 0) {
        const stats = channelData.items[0].statistics;
        setYoutubeStats({
          videoCount: parseInt(stats.videoCount || '0'),
          subscriberCount: formatSubscriberCount(stats.subscriberCount || '0')
        });
      }

      // Fetch latest videos (Shorts)
      console.log('Fetching videos for channel:', channelId);
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=10&type=video&videoDuration=short`
      );
      const videosData = await videosResponse.json();
      console.log('Videos data response:', videosData);

      if (videosData.items) {
        console.log('Setting YouTube videos:', videosData.items.length);
        setYoutubeVideos(videosData.items);
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  const formatSubscriberCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 275; // 259px width + 16px gap
      const newPosition = direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#141414] min-h-screen flex items-center justify-center">
        <div className="flex gap-[12px] items-center justify-center">
          <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
          <div className="w-[12px] h-[12px] rounded-full bg-[#898989]"></div>
          <div className="w-[12px] h-[12px] rounded-full bg-[#898989]"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#141414] min-h-screen flex items-center justify-center px-[40px] py-[24px]">
        <div className="flex flex-col gap-[8px] items-center justify-center">
          <p className="text-[rgba(255,255,255,0.9)] text-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Profile not found
          </p>
          <Link href="/" className="text-white text-[14px] underline" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Get social link by platform
  const getSocialLink = (platform: string) => {
    return profile.social_links?.find(link =>
      link.platform.toLowerCase() === platform.toLowerCase()
    )?.url || '#';
  };

  // Get primary and secondary categories/subcategories
  const categories = profile.category_name ? profile.category_name.split(',').map(c => c.trim()) : [];
  const subcategories = profile.subcategory_name ? profile.subcategory_name.split(',').map(s => s.trim()) : [];

  // Get tags
  const universalTags = profile.tags?.filter(tag => tag.type === 'universal') || [];

  return (
    <div className="bg-[#141414] min-h-screen px-[40px] py-[24px] flex flex-col gap-[80px]">
      {/* Header */}
      <div className="flex flex-col gap-[24px] w-full">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <p className="text-[24px] font-medium text-white leading-normal cursor-pointer hover:opacity-80 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Becometry
            </p>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-[8px] pl-[4px] pr-[8px] py-[8px] border-b border-white">
            <svg className="w-[24px] h-[24px] text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search experts by category or name "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white text-[14px] placeholder-[#898989] outline-none w-[270px] leading-[24px]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </form>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col gap-[64px] items-center justify-center w-full">
          {/* Profile Info */}
          <div className="flex flex-col gap-[20px] items-center">
            {/* Avatar */}
            <div className="flex flex-col gap-[12px] items-center w-full">
              <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden">
                <img
                  src={getImageUrl(profile.image_url)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name and Share Button */}
              <div className="flex flex-col gap-[8px] items-center w-full">
                <div className="flex gap-[8px] items-start justify-center w-full">
                  <p className="text-[24px] font-medium text-white leading-[32px] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {profile.name}
                  </p>
                  <div className="relative">
                    <button
                      className="bg-[#1b1b1b] border border-[rgba(255,255,255,0.05)] rounded-[40px] w-[32px] h-[32px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      onMouseEnter={() => setShowShareTooltip(true)}
                      onMouseLeave={() => setShowShareTooltip(false)}
                    >
                      <svg className="w-[16px] h-[10px]" viewBox="0 0 16 10" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.9999 4.70656C15.9999 4.87641 15.9292 5.03744 15.8042 5.14921L11.2328 9.26685C11.0643 9.41832 10.8236 9.45435 10.6207 9.3595C10.4164 9.26391 10.285 9.05508 10.285 8.82346V7.0139C9.5393 6.96611 8.79145 6.98081 8.05583 7.05581C5.55439 7.31023 3.08092 8.28964 0.903132 9.89044C0.803133 9.96397 0.68742 10 0.570997 10C0.438142 10 0.306005 9.95221 0.199584 9.85809C-0.000421656 9.68235 -0.0568321 9.38897 0.0610154 9.14707C0.74743 7.74487 2.36095 5.15743 5.46233 3.58981C6.94802 2.83834 8.60376 2.41702 10.2851 2.35893V0.588352C10.2851 0.357463 10.4158 0.14792 10.6208 0.0523158C10.8244 -0.0425376 11.0651 -0.0065077 11.2329 0.144963L15.8043 4.2626C15.9286 4.37436 16 4.53539 16 4.70525L15.9999 4.70656Z"/>
                      </svg>
                    </button>

                    {/* Tooltip */}
                    {showShareTooltip && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] z-50 flex flex-col items-center">
                        {/* Tooltip Content */}
                        <div className="bg-white rounded-[8px] px-[8px] py-[4px] whitespace-nowrap">
                          <p className="text-[14px] leading-[20px] text-[#141414] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Share profile
                          </p>
                        </div>

                        {/* Pointer */}
                        <div className="w-[14px] h-[6px] -mt-[1px]">
                          <svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.69842 4.88436L0 0H14L8.30158 4.88436C7.5526 5.52634 6.4474 5.52634 5.69842 4.88436Z" fill="white"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[20px] text-center w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {profile.insight}
                </p>
              </div>
            </div>

            {/* Categories and Subcategories */}
            <div className="flex flex-col gap-[12px] items-center">
              <div className="flex gap-[8px] items-center">
                {/* First Category Path */}
                {categories[0] && (
                  <>
                    <div className="bg-[rgba(255,255,255,0.11)] h-[32px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center">
                      <p className="text-white text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {categories[0]}
                      </p>
                    </div>
                    {subcategories[0] && (
                      <>
                        <svg className="w-[16px] h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="bg-[rgba(255,255,255,0.11)] h-[32px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center">
                          <p className="text-white text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {subcategories[0]}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Divider if there's a second category */}
                {categories[1] && (
                  <div className="h-[24px] w-[1px] bg-[rgba(255,255,255,0.1)]"></div>
                )}

                {/* Second Category Path */}
                {categories[1] && (
                  <>
                    <div className="bg-[rgba(255,255,255,0.11)] h-[32px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center">
                      <p className="text-white text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {categories[1]}
                      </p>
                    </div>
                    {subcategories[1] && (
                      <>
                        <svg className="w-[16px] h-[16px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="bg-[rgba(255,255,255,0.11)] h-[32px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center">
                          <p className="text-white text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {subcategories[1]}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Universal Tags */}
              {universalTags.length > 0 && (
                <div className="flex gap-[8px] items-start justify-center">
                  {universalTags.map((tag) => (
                    <div key={tag.id} className="border border-[rgba(255,255,255,0.1)] h-[24px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center">
                      <p className="text-white text-[12px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {tag.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-[12px] items-center justify-center w-[600px]">
              {/* Instagram */}
              {getSocialLink('instagram') !== '#' && (
                <a
                  href={getSocialLink('instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[32px] h-[32px] rounded-[40px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {getSocialLink('facebook') !== '#' && (
                <a
                  href={getSocialLink('facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[32px] h-[32px] rounded-[40px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {getSocialLink('tiktok') !== '#' && (
                <a
                  href={getSocialLink('tiktok')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[32px] h-[32px] rounded-[40px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {getSocialLink('linkedin') !== '#' && (
                <a
                  href={getSocialLink('linkedin')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[32px] h-[32px] rounded-[40px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* YouTube Carousel Section */}
          {getSocialLink('youtube') !== '#' && (
          <div className="flex flex-col gap-[24px] items-start justify-center w-full">
            <div className="flex gap-[8px] items-center w-full">
              <div className="flex-1 flex gap-[16px] items-center">
                <div className="flex gap-[12px] items-center">
                  <div className="relative w-[48px] h-[48px] rounded-full overflow-hidden">
                    <img
                      src={getImageUrl(profile.image_url)}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] h-[48px] justify-center">
                    <p className="text-[20px] font-medium text-white leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      YouTube carousel
                    </p>
                    <div className="flex gap-[8px] items-center">
                      <p className="text-[12px] text-[#dfdfdf] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {youtubeStats.videoCount} videos
                      </p>
                      <div className="w-[4px] h-[4px] rounded-full bg-[#dfdfdf]"></div>
                      <p className="text-[12px] text-[#dfdfdf] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {youtubeStats.subscriberCount} subscribers
                      </p>
                    </div>
                  </div>
                </div>
                <a
                  href={getSocialLink('youtube')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF0000] h-[32px] px-[16px] py-[8px] rounded-[40px] flex gap-[4px] items-center justify-center hover:bg-[#cc0000] transition-colors"
                >
                  <svg className="w-[16px] h-[16px] text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <p className="text-[14px] font-medium text-white leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Subscribe
                  </p>
                </a>
              </div>
              <div className="flex gap-[8px] items-center">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="bg-[#1b1b1b] border border-[rgba(255,255,255,0.05)] w-[48px] h-[48px] rounded-[40px] flex items-center justify-center"
                >
                  <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="bg-white w-[48px] h-[48px] rounded-[40px] flex items-center justify-center"
                >
                  <svg className="w-[24px] h-[24px] text-[#141414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Carousel */}
            <div ref={carouselRef} className="flex gap-[16px] items-center overflow-x-auto overflow-y-hidden w-full relative scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {youtubeVideos.length > 0 ? (
                youtubeVideos.map((video) => (
                  <div key={video.id.videoId} className="relative w-[259px] h-[327px] rounded-[20px] overflow-hidden flex-shrink-0">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      className="w-full h-full rounded-[20px]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                  <div key={index} className="relative w-[259px] h-[327px] rounded-[20px] overflow-hidden flex-shrink-0 bg-[#1b1b1b]">
                    <div className="flex items-center justify-center w-full h-full text-[#dfdfdf] text-[14px]">
                      Loading videos...
                    </div>
                  </div>
                ))
              )}

              {/* Gradient Overlay */}
              <div className="absolute right-0 top-0 w-[118px] h-[327px] bg-gradient-to-r from-[rgba(20,20,20,0)] to-[#141414] pointer-events-none"></div>
            </div>
          </div>
          )}

          {/* Hide scrollbar CSS */}
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Related Profiles Section */}
          {relatedProfiles.length > 0 && (
            <div className="flex flex-col gap-[24px] items-start justify-center w-full">
              <div className="flex gap-[8px] items-center w-full">
                <p className="text-[24px] font-medium text-white leading-[32px] flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Find more experts in {categories[0] || 'this category'}
                </p>
                <div className="flex gap-[8px] items-center">
                  <button className="bg-[#1b1b1b] border border-[rgba(255,255,255,0.05)] w-[48px] h-[48px] rounded-[40px] flex items-center justify-center">
                    <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="bg-white w-[48px] h-[48px] rounded-[40px] flex items-center justify-center">
                    <svg className="w-[24px] h-[24px] text-[#141414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Related Profiles Carousel */}
              <div className="flex gap-[16px] items-center overflow-hidden w-full relative">
                {relatedProfiles.map((relatedProfile) => (
                  <Link
                    key={relatedProfile.id}
                    href={`/profile/${relatedProfile.id}`}
                    className="relative w-[269px] h-[340px] rounded-[20px] overflow-hidden flex-shrink-0 p-[16px] flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img
                      src={getImageUrl(relatedProfile.image_url)}
                      alt={relatedProfile.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] via-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.7)]"></div>

                    <div className="bg-[rgba(255,255,255,0.11)] h-[32px] px-[8px] py-[8px] rounded-[36px] flex items-center justify-center w-fit relative z-10">
                      <p className="text-white text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {relatedProfile.category_name}
                      </p>
                    </div>

                    <div className="flex flex-col gap-[8px] relative z-10">
                      <p className="text-white text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {relatedProfile.name}
                      </p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[14px] leading-[20px] w-[237px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {relatedProfile.insight}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Gradient Overlay */}
                <div className="absolute right-0 top-0 w-[152px] h-[340px] bg-gradient-to-r from-[rgba(20,20,20,0)] to-[#141414] pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2c2c2c] pt-[16px] flex items-center justify-between w-full">
        <Link href="/">
          <p className="text-[24px] font-medium text-white leading-normal cursor-pointer hover:opacity-80 transition-opacity" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Becometry
          </p>
        </Link>
        <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Terms of service
        </p>
      </div>
    </div>
  );
}
