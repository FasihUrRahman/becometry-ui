'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProfileCard from '@/components/ProfileCard';
import LatestExperts from '@/components/LatestExperts';
import { profileApi } from '@/lib/profileApi';
import { categoryApi, Category as CategoryApiType } from '@/lib/categoryApi';
import { tagApi, Tag as TagApiType } from '@/lib/tagApi';
import { ProfileCard as ProfileCardType, ProfileFilters } from '@/types/profile';

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<ProfileCardType[]>([]);
  const [categories, setCategories] = useState<CategoryApiType[]>([]);
  const [tags, setTags] = useState<TagApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<ProfileFilters>({
    page: 1,
    limit: 20,
    random: true, // Add random flag for backend
  });

  // Fetch categories and tags on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          categoryApi.getAll(),
          tagApi.getAll(),
        ]);
        setCategories(categoriesData.data);
        setTags(tagsData.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Load more profiles
  const loadMoreProfiles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await profileApi.getProfiles({ ...filters, page });

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setProfiles(prev => [...prev, ...data.data]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, loading, hasMore]);

  // Initial load
  useEffect(() => {
    setProfiles([]);
    setPage(1);
    setHasMore(true);
    loadMoreProfiles();
  }, [filters.category_id, filters.subcategory_ids, filters.tag_ids, filters.search]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProfiles();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreProfiles, hasMore, loading]);

  const handleCategoryChange = (categoryId: number) => {
    setFilters(prev => ({
      ...prev,
      category_id: prev.category_id === categoryId ? undefined : categoryId,
      subcategory_ids: [],
      page: 1,
    }));
  };

  const handleSubcategoryToggle = (subcategoryId: number) => {
    setFilters(prev => ({
      ...prev,
      subcategory_ids: prev.subcategory_ids?.includes(subcategoryId)
        ? prev.subcategory_ids.filter(id => id !== subcategoryId)
        : [...(prev.subcategory_ids || []), subcategoryId],
      page: 1,
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFilters(prev => ({
      ...prev,
      tag_ids: prev.tag_ids?.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...(prev.tag_ids || []), tagId],
      page: 1,
    }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  };


  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold gradient-text mb-4">Explore</h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search profiles, categories, or tags..."
              className="w-full glass-effect rounded-xl px-6 py-4 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="glass-effect rounded-2xl p-6 sticky top-32">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark-100 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id}>
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.category_id === category.id
                            ? 'bg-accent-purple/20 text-accent-purple'
                            : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                        }`}
                      >
                        {category.name}
                      </button>

                      {/* Subcategories */}
                      {filters.category_id === category.id && category.subcategories && (
                        <div className="ml-4 mt-2 space-y-1">
                          {category.subcategories.map(sub => (
                            <label key={sub.id} className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-200 cursor-pointer py-1">
                              <input
                                type="checkbox"
                                checked={filters.subcategory_ids?.includes(sub.id)}
                                onChange={() => handleSubcategoryToggle(sub.id)}
                                className="rounded border-dark-700 bg-dark-800 text-accent-purple focus:ring-accent-purple/50"
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-dark-100 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filters.tag_ids?.includes(tag.id)
                          ? 'bg-accent-purple text-white'
                          : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-dark-200'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Latest Experts Section */}
            <div className="mb-8">
              <LatestExperts limit={10} showViewAll={true} />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-dark-400">
                {profiles.length} profiles loaded
              </p>
            </div>

            {/* Profile Grid - 4 columns */}
            {profiles.length === 0 && !loading ? (
              <div className="glass-effect rounded-2xl p-12 text-center">
                <p className="text-dark-400 text-lg">No profiles found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {profiles.map(profile => (
                    <ProfileCard
                      key={profile.id}
                      id={profile.id}
                      name={profile.name}
                      category={profile.category_name}
                      image_url={profile.image_url}
                      insight={profile.insight}
                    />
                  ))}
                </div>

                {/* Loading indicator */}
                {loading && (
                  <div className="mt-8 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-accent-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Infinite scroll trigger */}
                <div ref={observerTarget} className="h-10 mt-8" />

                {/* End message */}
                {!hasMore && profiles.length > 0 && (
                  <div className="mt-8 text-center text-dark-400">
                    You've reached the end!
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
