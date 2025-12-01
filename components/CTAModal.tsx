'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface CTAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CTAModal({ isOpen, onClose }: CTAModalProps) {
  const { login, register, isAuthenticated } = useAuth();
  const { favoritesCount } = useFavorites();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  // Reset form when tab changes
  useEffect(() => {
    setFormData({ email: '', password: '', name: '' });
    setError(null);
  }, [activeTab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      // Modal will close automatically via useEffect when isAuthenticated changes
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `${activeTab === 'login' ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md glass-effect rounded-3xl shadow-card border border-dark-700 p-8 animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-500 hover:text-dark-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-blue rounded-2xl flex items-center justify-center shadow-glow mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Save More Favorites</h2>
            <p className="text-dark-400">
              You've saved {favoritesCount} expert{favoritesCount !== 1 ? 's' : ''}. Create your free account to save more and organize them by category.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 glass-effect rounded-xl p-1">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-glow'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-glow'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field (Register only) */}
            {activeTab === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-dark-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-dark-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-dark-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/50 transition-all"
                placeholder="••••••••"
              />
              {activeTab === 'register' && (
                <p className="text-dark-500 text-xs mt-1">Minimum 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (activeTab === 'login' ? 'Logging in...' : 'Creating account...')
                : (activeTab === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 glass-effect rounded-xl p-4 border border-dark-700">
            <p className="text-sm font-semibold text-dark-300 mb-3">With a free account:</p>
            <ul className="space-y-2 text-sm text-dark-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save unlimited expert profiles
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Organize favorites by category
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Access from any device
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
