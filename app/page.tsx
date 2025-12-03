'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { profileApi } from '@/lib/profileApi';
import { categoryApi, Category } from '@/lib/categoryApi';
import { getImageUrl } from '@/lib/imageUtils';
import { ProfileCard } from '@/types/profile';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<ProfileCard[]>([]);
  const [countryExpanded, setCountryExpanded] = useState(true);
  const [languageExpanded, setLanguageExpanded] = useState(true);
  const [platformExpanded, setPlatformExpanded] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isSubcategoryExpanded, setIsSubcategoryExpanded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Update dropdown position when hoveredCategory changes or on scroll
  const updateDropdownPosition = (categoryId: number | null) => {
    if (categoryId !== null) {
      const element = document.getElementById(`cat-${categoryId}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom, left: rect.left });
      }
    } else {
      setDropdownPosition(null);
    }
  };

  // Continuously update position when dropdown is visible
  useEffect(() => {
    if (hoveredCategory === null) {
      setDropdownPosition(null);
      return;
    }

    let animationFrameId: number;

    const updatePosition = () => {
      updateDropdownPosition(hoveredCategory);
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hoveredCategory]);

  // Fetch profiles whenever filters or search query change
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const params: any = {
          limit: 200,
          status: 'published'
        };

        // Add search parameter
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        // Add filter parameters
        if (selectedCategoryId) {
          params.category_id = selectedCategoryId;
        }
        if (selectedSubcategoryId) {
          params.subcategory_ids = [selectedSubcategoryId];
        }
        if (selectedTagIds.length > 0) {
          params.tag_ids = selectedTagIds;
        }
        if (selectedCountries.length > 0) {
          params.countries = selectedCountries.join(',');
        }
        if (selectedLanguages.length > 0) {
          params.languages = selectedLanguages.join(',');
        }
        if (selectedPlatforms.length > 0) {
          params.platforms = selectedPlatforms.join(',');
        }

        const profilesData = await profileApi.getProfiles(params);

        if (profilesData.success && profilesData.data) {
          // Filter profiles by specific categories
          const allowedCategories = ['E-COMMERCE', 'ENTREPRENEURSHIP AND BUSINESS', 'EVERYDAY SKILLS & TIPS'];

          let profilesList = profilesData.data;

          // When no category filter is selected, only show allowed categories
          if (!selectedCategoryId && !searchQuery.trim()) {
            profilesList = profilesList.filter((profile: any) =>
              allowedCategories.includes(profile.category_name)
            );
          }

          // When no filters are applied, randomize the list
          if (!selectedCategoryId && !selectedSubcategoryId && selectedTagIds.length === 0 &&
              selectedCountries.length === 0 && selectedLanguages.length === 0 && selectedPlatforms.length === 0 && !searchQuery.trim()) {
            profilesList = [...profilesList].sort(() => Math.random() - 0.5);
          }

          setProfiles(profilesList);
          setFilteredProfiles(profilesList);
          setSearchResults(profilesList);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search API calls
    const timer = setTimeout(() => {
      fetchProfiles();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategoryId, selectedSubcategoryId, selectedTagIds, selectedCountries, selectedLanguages, selectedPlatforms, searchQuery]);

  // Fetch categories and filter options on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, filterOptionsResponse] = await Promise.all([
          categoryApi.getAll(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/profiles/filters`)
        ]);

        if (categoriesData.success && categoriesData.data) {
          setCategories(categoriesData.data);
        }

        const filterOptions = await filterOptionsResponse.json();
        if (filterOptions.success && filterOptions.data) {
          setAvailableCountries(filterOptions.data.countries || []);
          setAvailableLanguages(filterOptions.data.languages || []);
          setAvailablePlatforms(filterOptions.data.platforms || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const clearAllFilters = () => {
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setSelectedPlatforms([]);
  };

  const hasActiveFilters = selectedCountries.length > 0 || selectedLanguages.length > 0 || selectedPlatforms.length > 0;

  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      // Deselect category
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
      setSelectedTagIds([]);
    } else {
      // Select category
      setSelectedCategoryId(categoryId);
      setSelectedSubcategoryId(null);
      setSelectedTagIds([]);

      // Scroll selected category into view on mobile
      setTimeout(() => {
        const categoryButton = document.getElementById(`mobile-cat-${categoryId}`);
        if (categoryButton) {
          categoryButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 300);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryClick = async (subcategoryId: number) => {
    if (selectedSubcategoryId === subcategoryId) {
      // Deselect subcategory
      setSelectedSubcategoryId(null);
      setSelectedTagIds([]);
      setAvailableTags([]);
    } else {
      // Select subcategory
      setSelectedSubcategoryId(subcategoryId);
      setSelectedTagIds([]);

      // Scroll selected subcategory into view on mobile (use 'start' to keep category visible)
      setTimeout(() => {
        const subcategoryButton = document.getElementById(`mobile-subcat-${subcategoryId}`);
        if (subcategoryButton) {
          subcategoryButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      }, 300);

      // Fetch tags for the selected subcategory (only tags used by profiles in that subcategory)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/tags/subcategory/${subcategoryId}`);
        const data = await response.json();
        if (data.success && data.data) {
          setAvailableTags(data.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
  };

  // Handle tag selection/deselection
  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  // Get selected category object
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // Update search dropdown visibility when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Handle search state across viewport changes
  useEffect(() => {
    const handleResize = () => {
      const checkbox = document.getElementById('mobile-search-toggle') as HTMLInputElement;

      if (window.innerWidth >= 640) { // Desktop (sm breakpoint and above)
        // Reset mobile checkbox when switching to desktop
        if (checkbox) checkbox.checked = false;
      } else { // Mobile
        // If there's an active search query or dropdown, keep mobile search open
        if (checkbox && (searchQuery || showSearchDropdown)) {
          checkbox.checked = true;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [searchQuery, showSearchDropdown]);

  return (
    <div className="min-h-screen bg-[#141414] px-[20px] sm:px-[40px] py-[24px]">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="text-[20px] sm:text-[24px] font-medium text-white leading-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Becometry
        </h1>

        {/* Search - CSS-only mobile expand */}
        <div className="relative">
          {/* Mobile icon-only trigger */}
          <label htmlFor="mobile-search-toggle" className="
            /* Mobile: show icon only */
            sm:hidden
            w-10
            h-10
            flex
            items-center
            justify-center
            cursor-pointer
            hover:bg-[#1f1f1f]
            rounded-lg
            transition-colors
          ">
            <svg className="w-5 h-5 text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </label>
          
          {/* Hidden checkbox to control expand state */}
          <input 
            type="checkbox" 
            id="mobile-search-toggle" 
            className="hidden peer" 
          />
          
          {/* DESKTOP search bar - always visible on desktop */}
          <div className="
            /* Desktop: always show */
            hidden
            sm:flex
            items-center
            gap-[8px]
            pl-[4px]
            pr-[8px]
            py-[8px]
            border-b
            border-white
            w-[304px]
          ">
            <svg className="w-[24px] h-[24px] text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search experts by category or name "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="bg-transparent text-white text-[14px] placeholder-[#898989] outline-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-[24px] flex-1"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            {searchQuery && (
              <button onClick={() => {setSearchQuery(''); setShowSearchDropdown(false);}} className="text-white">
                <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* MOBILE expanded search bar - hidden by default, shown when checkbox is checked */}
          <div className="
            /* Hidden by default */
            hidden
            
            /* Show when checkbox is checked on mobile */
            peer-checked:flex
            peer-checked:fixed
            peer-checked:top-0
            peer-checked:left-0
            peer-checked:right-0
            peer-checked:bg-[#141414]
            peer-checked:p-4
            peer-checked:z-50
            peer-checked:items-center
            peer-checked:gap-2
            
            /* Hide on desktop */
            sm:hidden
          ">
            {/* Your exact search bar styles preserved */}
            <div className="flex items-center gap-[8px] pl-[4px] pr-[8px] py-[8px] border-b border-white w-full">
              <svg className="w-[24px] h-[24px] text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search experts by category or name "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                className="bg-transparent text-white text-[14px] placeholder-[#898989] outline-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-[24px] flex-1"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                id="mobile-search-input"
              />
              {searchQuery && (
                <button onClick={() => {setSearchQuery(''); setShowSearchDropdown(false);}} className="text-white">
                  <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Cancel button for mobile */}
            <label 
              htmlFor="mobile-search-toggle" 
              className="
                text-white
                px-3
                py-2
                cursor-pointer
              "
            >
              Cancel
            </label>
          </div>

          {/* Search Dropdown - Desktop: dropdown, Mobile: full screen */}
          {showSearchDropdown && searchQuery && (
            <div className="
              /* Mobile: Full screen */
              fixed
              top-[72px]
              left-0
              right-0
              bottom-0
              bg-[#141414]
              z-40
              overflow-y-auto
              p-[8px]
              py-[4px]

              /* Desktop: Dropdown */
              sm:absolute
              sm:right-0
              sm:top-[48px]
              sm:left-auto
              sm:bottom-auto
              sm:w-[304px]
              sm:bg-[#1b1b1b]
              sm:border
              sm:border-[rgba(255,255,255,0.05)]
              sm:rounded-[8px]
              sm:overflow-hidden

              /* Show on desktop always, on mobile only when expanded */
              hidden
              peer-checked:block
              sm:block
            " style={{ boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.4)' }}>
              {searchResults.length > 0 ? (
                      <div className="flex flex-col gap-[2px]">
                        {searchResults.map((profile, index) => (
                          <div
                            key={profile.id}
                            className={`flex items-center gap-[8px] pl-[4px] pr-[8px] py-[4px] rounded-[4px] cursor-pointer transition-colors ${index === 1 ? 'bg-[#252525]' : 'hover:bg-[#252525]'}`}
                            onClick={() => {
                              setSearchQuery(profile.name);
                              setShowSearchDropdown(false);
                              const checkbox = document.getElementById('mobile-search-toggle') as HTMLInputElement;
                              if (checkbox) checkbox.checked = false;
                            }}
                          >
                            <div className="w-[32px] h-[32px] rounded-[4px] overflow-hidden flex-shrink-0">
                              <img src={getImageUrl(profile.image_url)} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-white text-[14px] leading-[20px] flex-1 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>{profile.name}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-[20px] text-center">
                        <p className="text-[rgba(255,255,255,0.6)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>No matching results.</p>
                      </div>
                    )}
            </div>
          )}
        </div>
      </div>

      {/* Category Menu + Subcategories + Tags */}
      <div className="flex flex-col gap-[16px] mb-[24px]">
        {/* Desktop: Carousel - Mobile: Expandable Grid */}
        <div className="relative">
          {/* Desktop Carousel */}
          <div className="hidden sm:block relative group">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('categories-carousel');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Categories Container */}
            <div
              id="categories-carousel"
              className="flex gap-[22px] items-center overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative flex-shrink-0 static"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`h-[24px] py-[8px] flex items-center gap-[2px] rounded-[8px] text-[14px] leading-[20px] transition-all whitespace-nowrap ${
                      selectedCategoryId === category.id
                        ? 'bg-white text-black font-medium pl-[8px] pr-[4px]'
                        : hoveredCategory === category.id
                        ? 'bg-[#1f1f1f] text-white pl-[8px] pr-[4px]'
                        : 'bg-[#141414] text-white px-[8px]'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {category.name}
                    {(selectedCategoryId === category.id || hoveredCategory === category.id) && (
                      <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown - Using fixed positioning portal-style */}
                  {hoveredCategory === category.id && selectedCategoryId !== category.id && category.subcategories && category.subcategories.length > 0 && dropdownPosition && (
                    <div
                      className="fixed z-[100] pt-[4px]"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`
                      }}
                    >
                      <div
                        className="bg-[#1b1b1b] border border-[rgba(255,255,255,0.05)] rounded-[8px] p-[4px] flex flex-col gap-[2px] w-auto min-w-[200px]"
                        style={{ boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.4)' }}
                      >
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              handleCategoryClick(category.id);
                              handleSubcategoryClick(subcategory.id);
                            }}
                            className="bg-[#1b1b1b] hover:bg-[rgba(255,255,255,0.05)] h-[32px] px-[8px] flex items-center rounded-[4px] text-white text-[14px] leading-[20px] text-left transition-colors whitespace-nowrap"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden element for positioning reference */}
                  <div id={`cat-${category.id}`} className="absolute top-full left-0 w-0 h-0 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('categories-carousel');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile: Expandable Category Grid */}
          <div className="sm:hidden">
            {/* Collapsed view - two columns: categories | arrow */}
            {!isCategoryExpanded && (
              <div className="flex flex-col gap-[16px]">
                <div className="flex gap-[6px] items-center">
                  {/* Categories Column */}
                  <div className="flex gap-[6px] items-center overflow-x-auto scrollbar-hide flex-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        id={`mobile-cat-${category.id}`}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`h-[32px] px-[12px] py-[6px] flex items-center gap-[4px] rounded-[48px] text-[14px] leading-[20px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          selectedCategoryId === category.id
                            ? 'bg-white text-black'
                            : 'text-[#898989]'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* Arrow Column */}
                  <button
                    onClick={() => setIsCategoryExpanded(true)}
                    className="flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Subcategories Row - shown when category is selected */}
                {!isSubcategoryExpanded && selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                  <div className="flex gap-[6px] items-center">
                    {/* Subcategories Column */}
                    <div className="flex gap-[6px] items-center overflow-x-auto scrollbar-hide flex-1"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {selectedCategory.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          id={`mobile-subcat-${subcategory.id}`}
                          onClick={() => handleSubcategoryClick(subcategory.id)}
                          className={`h-[32px] px-[12px] py-[6px] flex items-center gap-[4px] rounded-[48px] text-[14px] leading-[20px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                            selectedSubcategoryId === subcategory.id
                              ? 'bg-white text-black'
                              : 'text-[#898989]'
                          }`}
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>

                    {/* Subcategory Arrow Column */}
                    <button
                      onClick={() => setIsSubcategoryExpanded(true)}
                      className="flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-[#898989]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Expanded view - Category Overlay */}
            {isCategoryExpanded && (
              <div className="absolute left-0 right-0 bg-[#141414] border border-[rgba(255,255,255,0.05)] z-50 max-h-[340px] flex flex-col"
                style={{ boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.48)' }}
              >
                {/* Scrollable content */}
                <div className="overflow-y-auto px-[20px] pt-[16px] pb-[16px] flex-1">
                  {/* Categories wrapped grid */}
                  <div className="flex flex-wrap gap-[6px] items-center">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategoryClick(category.id);
                          setIsCategoryExpanded(false);
                        }}
                        className={`h-[32px] px-[12px] py-[6px] flex items-center gap-[4px] rounded-[48px] text-[14px] leading-[20px] font-medium transition-all whitespace-nowrap ${
                          selectedCategoryId === category.id
                            ? 'bg-white text-black'
                            : 'text-[#898989]'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapse Button - Always visible at bottom */}
                <div className="flex justify-center py-[16px] border-t border-transparent flex-shrink-0">
                  <button
                    onClick={() => setIsCategoryExpanded(false)}
                    className="flex items-center gap-[4px] px-[8px] py-[8px] rounded-[40px]"
                  >
                    <span className="text-white text-[14px] leading-[24px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Collapse
                    </span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Expanded view - Subcategory Overlay */}
            {isSubcategoryExpanded && selectedCategory && selectedCategory.subcategories && (
              <div className="absolute left-0 right-0 bg-[#141414] border border-[rgba(255,255,255,0.05)] z-50 max-h-[340px] flex flex-col"
                style={{ boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.48)' }}
              >
                {/* Scrollable content */}
                <div className="overflow-y-auto px-[20px] pt-[16px] pb-[16px] flex-1">
                  {/* Subcategories wrapped grid */}
                  <div className="flex flex-wrap gap-[6px] items-center">
                    {selectedCategory.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          handleSubcategoryClick(subcategory.id);
                          setIsSubcategoryExpanded(false);
                        }}
                        className={`h-[32px] px-[12px] py-[6px] flex items-center gap-[4px] rounded-[48px] text-[14px] leading-[20px] font-medium transition-all whitespace-nowrap ${
                          selectedSubcategoryId === subcategory.id
                            ? 'bg-white text-black'
                            : 'text-[#898989]'
                        }`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collapse Button - Always visible at bottom */}
                <div className="flex justify-center py-[16px] border-t border-transparent flex-shrink-0">
                  <button
                    onClick={() => setIsSubcategoryExpanded(false)}
                    className="flex items-center gap-[4px] px-[8px] py-[8px] rounded-[40px]"
                  >
                    <span className="text-white text-[14px] leading-[24px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Collapse
                    </span>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Row - shown when category is selected (Desktop only, mobile shows in overlay) */}
        {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
          <div className="hidden sm:block relative group">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('subcategories-carousel');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Subcategories Container */}
            <div
              id="subcategories-carousel"
              className="flex gap-[8px] items-center overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {selectedCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                  className={`h-[24px] py-[8px] px-[8px] flex items-center gap-[2px] rounded-[8px] text-[14px] leading-[20px] transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedSubcategoryId === subcategory.id
                      ? 'bg-white text-black font-medium'
                      : 'bg-[#141414] text-white'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('subcategories-carousel');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Horizontal Divider - Desktop only */}
        {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
          <div className="hidden sm:block h-px bg-[rgba(217,217,217,0.08)]"></div>
        )}

        {/* Tags Row - shown when subcategory is selected */}
        {selectedSubcategoryId && availableTags.length > 0 && (
          <div>
            {/* Desktop: Carousel */}
            <div className="hidden sm:block relative group">
              {/* Left Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById('tags-carousel');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Tags Container */}
              <div
                id="tags-carousel"
                className="flex gap-[8px] items-center overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`h-[28px] px-[12px] py-[8px] flex items-center gap-[2px] rounded-[36px] border transition-all whitespace-nowrap flex-shrink-0 ${
                      selectedTagIds.includes(tag.id)
                        ? 'bg-white text-black font-medium border-[rgba(255,255,255,0.1)]'
                        : 'bg-[rgba(255,255,255,0.04)] text-white border-[rgba(255,255,255,0.1)]'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <p className="text-[14px] leading-[16px]">{tag.name}</p>
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById('tags-carousel');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile: Wrapped Grid */}
            <div className="sm:hidden flex flex-wrap gap-[6px] items-center">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`h-[28px] px-[12px] py-[8px] flex items-center gap-[2px] rounded-[36px] border transition-all whitespace-nowrap ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-white text-black font-medium border-[rgba(255,255,255,0.1)]'
                      : 'bg-[rgba(255,255,255,0.04)] text-white border-[rgba(255,255,255,0.1)]'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <p className="text-[14px] leading-[16px]">{tag.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex gap-[24px] items-start">
        {/* Filters Sidebar */}
        <div className="hidden md:flex flex-col gap-[16px] w-[180px] flex-shrink-0">
          <p className="text-white text-[16px] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Filters</p>

          {/* Country Filter */}
          <div className="flex flex-col gap-[8px]">
            <button
              onClick={() => setCountryExpanded(!countryExpanded)}
              className="flex items-center gap-[12px] w-full text-left"
            >
              <p className="flex-1 text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Select country</p>
              <svg
                className={`w-[24px] h-[24px] text-white flex-shrink-0 transition-transform ${countryExpanded ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            {countryExpanded && (
              <div className="flex flex-col gap-[4px] pr-[8px] max-h-[200px] overflow-y-auto custom-scrollbar relative">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => toggleCountry(country)}
                    className="flex items-center gap-[8px] text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                      selectedCountries.includes(country)
                        ? 'bg-white border-white'
                        : 'border-[#898989]'
                    }`}>
                      {selectedCountries.includes(country) && (
                        <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{country}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-[rgba(217,217,217,0.08)]"></div>

          {/* Language Filter */}
          <div className="flex flex-col gap-[8px]">
            <button
              onClick={() => setLanguageExpanded(!languageExpanded)}
              className="flex items-center gap-[12px] w-full text-left"
            >
              <p className="flex-1 text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Select language</p>
              <svg
                className={`w-[24px] h-[24px] text-white flex-shrink-0 transition-transform ${languageExpanded ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            {languageExpanded && (
              <div className="flex flex-col gap-[4px] pr-[8px] max-h-[200px] overflow-y-auto custom-scrollbar relative">
                {availableLanguages.map((language) => (
                  <button
                    key={language}
                    onClick={() => toggleLanguage(language)}
                    className="flex items-center gap-[8px] text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                      selectedLanguages.includes(language)
                        ? 'bg-white border-white'
                        : 'border-[#898989]'
                    }`}>
                      {selectedLanguages.includes(language) && (
                        <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{language}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-[rgba(217,217,217,0.08)]"></div>

          {/* Platform Filter */}
          <div className="flex flex-col gap-[8px]">
            <button
              onClick={() => setPlatformExpanded(!platformExpanded)}
              className="flex items-center gap-[12px] w-full text-left"
            >
              <p className="flex-1 text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Select platform</p>
              <svg
                className={`w-[24px] h-[24px] text-white flex-shrink-0 transition-transform ${platformExpanded ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            {platformExpanded && (
              <div className="flex flex-col gap-[4px] pr-[8px] max-h-[200px] overflow-y-auto custom-scrollbar relative">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className="flex items-center gap-[8px] text-left hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                      selectedPlatforms.includes(platform)
                        ? 'bg-white border-white'
                        : 'border-[#898989]'
                    }`}>
                      {selectedPlatforms.includes(platform) && (
                        <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px] capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>{platform.replace('_', ' ')}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(217, 217, 217, 0.08);
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(217, 217, 217, 0.15);
          }
        `}</style>

        {/* Vertical Divider */}
        <div className="w-px bg-[rgba(217,217,217,0.08)] h-[662px]"></div>

        {/* Content Grid */}
        <div className="flex-1">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-[24px]">
              <div className="flex flex-wrap gap-[8px] items-center">
                {selectedCountries.map((country) => (
                  <div key={country} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] h-[24px] pl-[8px] pr-[4px] py-[8px] rounded-[36px] flex items-center gap-[2px]">
                    <p className="text-white text-[12px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{country}</p>
                    <button onClick={() => toggleCountry(country)} className="w-[24px] h-[24px] flex items-center justify-center text-white hover:opacity-70 transition-opacity">
                      <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedLanguages.map((language) => (
                  <div key={language} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] h-[24px] pl-[8px] pr-[4px] py-[8px] rounded-[36px] flex items-center gap-[2px]">
                    <p className="text-white text-[12px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{language}</p>
                    <button onClick={() => toggleLanguage(language)} className="w-[24px] h-[24px] flex items-center justify-center text-white hover:opacity-70 transition-opacity">
                      <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedPlatforms.map((platform) => (
                  <div key={platform} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] h-[24px] pl-[8px] pr-[4px] py-[8px] rounded-[36px] flex items-center gap-[2px]">
                    <p className="text-white text-[12px] leading-[16px] capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>{platform.replace('_', ' ')}</p>
                    <button onClick={() => togglePlatform(platform)} className="w-[24px] h-[24px] flex items-center justify-center text-white hover:opacity-70 transition-opacity">
                      <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-[4px] h-[32px] pl-[4px] pr-[8px] py-[8px] rounded-[40px] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-white text-[14px] font-medium leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Clear all </p>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-[596px]">
              <div className="flex gap-[12px] items-center justify-center">
                <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#898989]"></div>
                <div className="w-[12px] h-[12px] rounded-full bg-[#898989]"></div>
              </div>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="flex flex-col gap-[8px] items-center justify-center h-[400px]">
              <div className="relative w-[120px] h-[120px]">
                {/* Stack of three cards */}
                <div className="absolute left-[12.3px] top-[19.92px]">
                  <div className="absolute" style={{ transform: 'rotate(350.769deg)', transformOrigin: 'center' }}>
                    <div className="bg-[#2e2e2e] border-4 border-[#141414] rounded-[16px] w-[63.91px] h-[68.276px]"></div>
                  </div>
                </div>
                <div className="absolute left-[20.43px] top-[13.34px]">
                  <div className="absolute" style={{ transform: 'rotate(356.664deg)', transformOrigin: 'center' }}>
                    <div className="bg-[#2e2e2e] border-4 border-[#141414] rounded-[16px] w-[67.834px] h-[77.612px]"></div>
                  </div>
                </div>
                <div className="absolute left-[27.28px] top-[5.47px]">
                  <div className="absolute" style={{ transform: 'rotate(6.912deg)', transformOrigin: 'center' }}>
                    <div className="bg-[#2e2e2e] border-4 border-[#141414] rounded-[16px] w-[71.873px] h-[86.511px]"></div>
                  </div>
                </div>
              </div>
              <p className="text-[rgba(255,255,255,0.9)] text-[14px] leading-[20px] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                No experts here just yet, but great ones are on their way!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[8px] sm:gap-[16px]">
              {/* Row 1 - Category cards column */}
              <div className="flex flex-col gap-[8px] sm:gap-[16px]">
                {/* Health Category Card */}
                <div className="rounded-[12px] sm:rounded-[20px] h-[161.5px] p-[12px] sm:p-[16px] flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(164.171deg, rgba(0, 0, 0, 0) 16.038%, rgba(195, 31, 115, 0.49) 82.487%), linear-gradient(90deg, rgba(31, 28, 31, 0.53) 0%, rgba(31, 28, 31, 0.53) 100%)' }}>
                  <p className="text-white text-[20px] font-medium leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Health</p>
                  <div className="flex flex-wrap gap-[4px]">
                    {['Functional Training', 'Calisthenics', 'Gym Training', 'HIIT Workouts'].map((tag) => (
                      <div key={tag} className="bg-[rgba(255,255,255,0.11)] px-[6px] py-[2px] rounded-[36px]">
                        <p className="text-white text-[12px] leading-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Finance Category Card */}
                <div className="rounded-[12px] sm:rounded-[20px] h-[161.5px] p-[12px] sm:p-[16px] flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(164.171deg, rgba(0, 0, 0, 0) 16.038%, rgba(24, 63, 31, 0.49) 82.487%), linear-gradient(90deg, rgba(31, 28, 31, 0.53) 0%, rgba(31, 28, 31, 0.53) 100%)' }}>
                  <p className="text-white text-[20px] font-medium leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Finance</p>
                  <div className="flex flex-wrap gap-[4px]">
                    {['Credit', 'Stock', 'Wealth Planning', 'Investing', 'Debt', 'Tax'].map((tag) => (
                      <div key={tag} className="bg-[rgba(255,255,255,0.11)] px-[6px] py-[2px] rounded-[36px]">
                        <p className="text-white text-[12px] leading-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Card - Emily Carter */}
                {filteredProfiles[0] && (
                <Link href={`/profile/${filteredProfiles[0].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[220px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[0].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[0].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[0].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[0].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Profile Card - Daniel Harris */}
                {filteredProfiles[1] && (
                <Link href={`/profile/${filteredProfiles[1].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[180px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[1].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[1].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[1].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[1].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Profile Card - David Johnson */}
                {filteredProfiles[2] && (
                <Link href={`/profile/${filteredProfiles[2].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[230px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[2].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[2].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[2].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[2].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Row 2 */}
                {/* Profile Card - Tom Li */}
                {filteredProfiles[3] && (
                <Link href={`/profile/${filteredProfiles[3].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[160px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[3].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[3].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[3].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[3].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Profile Card - Ethan Walker */}
                {filteredProfiles[4] && (
                <Link href={`/profile/${filteredProfiles[4].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[220px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[4].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[4].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[4].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[4].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Top-100 nutrition experts card */}
                <div className="bg-[rgba(31,28,31,0.53)] rounded-[12px] sm:rounded-[20px] p-[12px] sm:p-[16px] flex flex-col gap-[8px] sm:gap-[12px]">
                  <div className="flex flex-col gap-[8px] sm:gap-[11px]">
                    <p className="text-white text-[14px] sm:text-[18px] font-medium leading-[20px] sm:leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Top-100 nutrition experts</p>
                    <div className="flex items-end gap-[8px]">
                      <div className="flex items-center flex-1">
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] -mr-[15px] overflow-hidden">
                          <img src="https://i.pravatar.cc/100?img=16" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] -mr-[15px] overflow-hidden">
                          <img src="https://i.pravatar.cc/100?img=17" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] -mr-[15px] overflow-hidden">
                          <img src="https://i.pravatar.cc/100?img=18" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] -mr-[15px] overflow-hidden">
                          <img src="https://i.pravatar.cc/100?img=19" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] -mr-[15px] overflow-hidden">
                          <img src="https://i.pravatar.cc/100?img=20" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-[#1b191b] bg-[#393636] flex items-center justify-center">
                          <p className="text-white text-[12px] leading-[24px]" style={{ fontFamily: 'Inter, sans-serif' }}>+10</p>
                        </div>
                      </div>
                      <button className="bg-white rounded-[40px] w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                        <svg className="w-[12px] h-[9px]" viewBox="0 0 12 9" fill="none">
                          <path d="M0.75 4.28564H10.5M10.5 4.28564L7.5 0.785645M10.5 4.28564L7.5 7.78564" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Card - Emily Carter */}
                {filteredProfiles[6] && (
                <Link href={`/profile/${filteredProfiles[6].id}`}>
                  <div
                    className="relative rounded-[12px] sm:rounded-[20px] h-[180px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(filteredProfiles[6].image_url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                      <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[6].category_name}</p>
                    </div>
                    <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                      <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[6].name}</p>
                      <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{filteredProfiles[6].insight}</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Row 3+ - More profiles */}
                {filteredProfiles.slice(7).map((profile) => (
                  <Link key={profile.id} href={`/profile/${profile.id}`}>
                    <div
                      className="relative rounded-[12px] sm:rounded-[20px] h-[220px] sm:h-[340px] p-[12px] sm:p-[16px] flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0) 56.731%, rgba(0,0,0,0.7) 100%), url(${getImageUrl(profile.image_url)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="bg-[rgba(255,255,255,0.11)] px-[6px] sm:px-[8px] py-[6px] sm:py-[8px] h-[28px] sm:h-[32px] flex items-center justify-center rounded-[36px] w-fit">
                        <p className="text-white text-[12px] sm:text-[14px] leading-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{profile.category_name}</p>
                      </div>
                      <div className="flex flex-col gap-[4px] sm:gap-[8px]">
                        <p className="text-white text-[16px] sm:text-[20px] font-medium leading-[20px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{profile.name}</p>
                        <p className="text-[rgba(255,255,255,0.9)] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px] line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{profile.insight}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Button - Mobile Only (Fixed at bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[92px] pointer-events-none z-40"
        style={{ background: 'linear-gradient(180deg, rgba(20, 20, 20, 0) 0%, #141414 100%)' }}
      >
        <div className="flex justify-center items-center h-full px-[12px] pb-[24px] pointer-events-auto">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-[8px] px-[16px] pr-[12px] py-[8px] h-[44px] bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] rounded-[40px]"
          >
            <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.5h14.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h9.75" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.5h9.75" />
            </svg>
            <span className="text-white text-[14px] leading-[24px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {hasActiveFilters ? `${selectedCountries.length + selectedLanguages.length + selectedPlatforms.length} Filters` : 'Filter'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Modal - Mobile Only */}
      {isFilterModalOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFilterModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full bg-[#141414] rounded-t-[24px] max-h-[80vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[rgba(255,255,255,0.1)]">
              <h2 className="text-white text-[20px] leading-[24px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Filters</h2>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.05)]"
              >
                <svg className="w-[24px] h-[24px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-[20px] py-[24px]">
              {/* Country Filter */}
              <div className="flex flex-col gap-[16px] mb-[24px]">
                <button
                  onClick={() => setCountryExpanded(!countryExpanded)}
                  className="flex items-center gap-[12px] w-full text-left"
                >
                  <p className="flex-1 text-white text-[14px] leading-[20px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Select country</p>
                  <svg
                    className={`w-[24px] h-[24px] text-[#898989] flex-shrink-0 transition-transform ${countryExpanded ? '' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                {countryExpanded && (
                  <div className="flex flex-col gap-[12px]">
                    {availableCountries.map((country) => (
                      <button
                        key={country}
                        onClick={() => toggleCountry(country)}
                        className="flex items-center gap-[8px] text-left"
                      >
                        <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                          selectedCountries.includes(country)
                            ? 'bg-white border-white'
                            : 'border-[#898989]'
                        }`}>
                          {selectedCountries.includes(country) && (
                            <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{country}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-[rgba(217,217,217,0.08)] mb-[24px]"></div>

              {/* Language Filter */}
              <div className="flex flex-col gap-[16px] mb-[24px]">
                <button
                  onClick={() => setLanguageExpanded(!languageExpanded)}
                  className="flex items-center gap-[12px] w-full text-left"
                >
                  <p className="flex-1 text-white text-[14px] leading-[20px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Select language</p>
                  <svg
                    className={`w-[24px] h-[24px] text-[#898989] flex-shrink-0 transition-transform ${languageExpanded ? '' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                {languageExpanded && (
                  <div className="flex flex-col gap-[12px]">
                    {availableLanguages.map((language) => (
                      <button
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        className="flex items-center gap-[8px] text-left"
                      >
                        <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                          selectedLanguages.includes(language)
                            ? 'bg-white border-white'
                            : 'border-[#898989]'
                        }`}>
                          {selectedLanguages.includes(language) && (
                            <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{language}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-[rgba(217,217,217,0.08)] mb-[24px]"></div>

              {/* Platform Filter */}
              <div className="flex flex-col gap-[16px]">
                <button
                  onClick={() => setPlatformExpanded(!platformExpanded)}
                  className="flex items-center gap-[12px] w-full text-left"
                >
                  <p className="flex-1 text-white text-[14px] leading-[20px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Select platform</p>
                  <svg
                    className={`w-[24px] h-[24px] text-[#898989] flex-shrink-0 transition-transform ${platformExpanded ? '' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                {platformExpanded && (
                  <div className="flex flex-col gap-[12px]">
                    {availablePlatforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className="flex items-center gap-[8px] text-left"
                      >
                        <div className={`w-[16px] h-[16px] border rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                          selectedPlatforms.includes(platform)
                            ? 'bg-white border-white'
                            : 'border-[#898989]'
                        }`}>
                          {selectedPlatforms.includes(platform) && (
                            <svg className="w-[10px] h-[10px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[14px] text-[rgba(255,255,255,0.9)] leading-[24px] capitalize" style={{ fontFamily: 'Poppins, sans-serif' }}>{platform.replace('_', ' ')}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Apply Button */}
            <div className="px-[20px] py-[16px] border-t border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full h-[44px] bg-white text-black text-[14px] leading-[24px] font-medium rounded-[40px] hover:bg-[rgba(255,255,255,0.9)]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
