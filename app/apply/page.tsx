'use client';

import { useState, useEffect } from 'react';
import { submissionApi } from '@/lib/submissionApi';
import { categoryApi, Category } from '@/lib/categoryApi';
import { tagApi, Tag } from '@/lib/tagApi';

export default function ApplyPage() {
  // Form type: 'apply' (apply yourself) or 'suggest' (suggest someone else)
  const [formType, setFormType] = useState<'apply' | 'suggest'>('apply');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subcategory: '',
    bio: '',
    youtube: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    website: '',
    tags: [] as number[],
    suggestCategory: '',
    suggestSubcategory: '',
    suggestTags: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories, subcategories, and tags
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [universalTags, setUniversalTags] = useState<Tag[]>([]);
  const [contextualTags, setContextualTags] = useState<Tag[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load categories and tags on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, universalTagsRes] = await Promise.all([
          categoryApi.getAll(),
          tagApi.getUniversal()
        ]);

        // Filter parent categories only
        const parentCategories = categoriesRes.data.filter(c => c.parent_id === null);
        setCategories(parentCategories);
        setUniversalTags(universalTagsRes.data);
      } catch (err) {
        console.error('Error loading form data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const loadSubcategories = async () => {
        try {
          const categoryId = parseInt(formData.category);
          const [subRes, contextualTagsRes] = await Promise.all([
            categoryApi.getSubcategories(categoryId),
            tagApi.getContextual(categoryId)
          ]);
          setSubcategories(subRes.data);
          setContextualTags(contextualTagsRes.data);
        } catch (err) {
          console.error('Error loading subcategories:', err);
          setSubcategories([]);
          setContextualTags([]);
        }
      };
      loadSubcategories();
    } else {
      setSubcategories([]);
      setContextualTags([]);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submissionApi.create(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
        <div className="glass-effect rounded-3xl p-12 text-center max-w-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Application Submitted!</h1>
          <p className="text-xl text-dark-300 mb-8">
            Thank you for applying to join Becometry. We'll review your application and get back to you within 5-7 business days.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-400 text-xl">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="glass-effect border-b border-dark-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            {formType === 'apply' ? 'Apply to Join' : 'Suggest an Expert'}
          </h1>
          <p className="text-xl text-dark-400">
            {formType === 'apply'
              ? 'Join our curated directory of creators, mentors, and experts. Share your expertise with a global audience.'
              : 'Know someone who should be featured? Suggest an expert to join our directory.'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12" suppressHydrationWarning>
        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-8 md:p-12 shadow-card" suppressHydrationWarning>
          {/* Form Type Selector */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">I want to...</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormType('apply')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formType === 'apply'
                    ? 'border-accent-purple bg-accent-purple/10 shadow-glow'
                    : 'border-dark-700 hover:border-dark-600'
                }`}
              >
                <div className="text-2xl mb-2">🙋</div>
                <h3 className="text-lg font-bold text-white mb-1">Apply Myself</h3>
                <p className="text-sm text-dark-400">Showcase your own expertise</p>
              </button>
              <button
                type="button"
                onClick={() => setFormType('suggest')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formType === 'suggest'
                    ? 'border-accent-blue bg-accent-blue/10 shadow-glow'
                    : 'border-dark-700 hover:border-dark-600'
                }`}
              >
                <div className="text-2xl mb-2">👥</div>
                <h3 className="text-lg font-bold text-white mb-1">Suggest Someone</h3>
                <p className="text-sm text-dark-400">Recommend an expert</p>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-10" suppressHydrationWarning>
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

            <div className="space-y-6" suppressHydrationWarning>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-dark-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-dark-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-dark-300 mb-2">
                  Primary Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory (shows when category is selected) */}
              {formData.category && subcategories.length > 0 && (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-semibold text-dark-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  >
                    <option value="">Select a subcategory (optional)</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-dark-300 mb-2">
                  Bio / Insight *
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
                  placeholder="Tell us about your expertise and what makes you unique..."
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Tags</h2>
            <p className="text-dark-400 mb-6">Select tags that describe your expertise (select at least 3)</p>

            {/* Universal Tags (Always shown first) */}
            {universalTags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-dark-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-purple rounded-full"></span>
                  Universal Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {universalTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.tags.includes(tag.id)
                          ? 'bg-accent-purple text-white shadow-glow'
                          : 'glass-effect border border-dark-700 text-dark-300 hover:border-accent-purple'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Tags (Shown when category is selected) */}
            {formData.category && contextualTags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-dark-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
                  Recommended for {categories.find(c => c.id === parseInt(formData.category))?.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contextualTags.slice(0, showAllTags ? undefined : 15).map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.tags.includes(tag.id)
                          ? 'bg-accent-blue text-white shadow-glow'
                          : 'glass-effect border border-dark-700 text-dark-300 hover:border-accent-blue'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>

                {contextualTags.length > 15 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-4 text-accent-purple hover:text-accent-blue transition-colors text-sm font-semibold"
                  >
                    {showAllTags ? '↑ Show Less' : `↓ View All ${contextualTags.length} Tags`}
                  </button>
                )}
              </div>
            )}

            {/* Selected Tags Count */}
            <div className="glass-effect border border-dark-700 rounded-xl p-4">
              <p className="text-sm text-dark-400">
                Selected: <span className="text-white font-semibold">{formData.tags.length}</span> tag{formData.tags.length !== 1 ? 's' : ''}
                {formData.tags.length < 3 && <span className="text-accent-purple ml-2">(Select at least 3)</span>}
              </p>
            </div>
          </div>

          {/* Suggest New Tags/Categories */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Don't see what you're looking for?</h2>
            <p className="text-dark-400 mb-6">Suggest new categories, subcategories, or tags</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="suggestCategory" className="block text-sm font-semibold text-dark-300 mb-2">
                  Suggest Category
                </label>
                <input
                  type="text"
                  id="suggestCategory"
                  name="suggestCategory"
                  value={formData.suggestCategory}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="e.g., Machine Learning, Sustainable Design"
                />
              </div>

              <div>
                <label htmlFor="suggestSubcategory" className="block text-sm font-semibold text-dark-300 mb-2">
                  Suggest Subcategory
                </label>
                <input
                  type="text"
                  id="suggestSubcategory"
                  name="suggestSubcategory"
                  value={formData.suggestSubcategory}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="e.g., Computer Vision, Green Architecture"
                />
              </div>

              <div>
                <label htmlFor="suggestTags" className="block text-sm font-semibold text-dark-300 mb-2">
                  Suggest Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="suggestTags"
                  name="suggestTags"
                  value={formData.suggestTags}
                  onChange={handleChange}
                  className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="e.g., Neural Networks, YOLO, PyTorch"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Social Links</h2>
            <p className="text-dark-400 mb-6">Add at least one social media profile</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="youtube" className="block text-sm font-semibold text-dark-300 mb-2">
                  YouTube
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-semibold text-dark-300 mb-2">
                  Twitter / X
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-semibold text-dark-300 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-dark-300 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-dark-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || formData.tags.length < 3}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' :
               formData.tags.length < 3 ? `Select ${3 - formData.tags.length} More Tag${3 - formData.tags.length !== 1 ? 's' : ''} to Continue` :
               formType === 'apply' ? 'Submit Application' : 'Submit Suggestion'}
            </button>
          </div>

          <p className="text-center text-dark-500 text-sm mt-6">
            {formType === 'apply'
              ? 'By submitting, you agree to our review process. We\'ll get back to you within 5-7 business days.'
              : 'By submitting, you\'re recommending this person to be featured in our directory. Thank you!'}
          </p>
        </form>
      </div>
    </div>
  );
}
