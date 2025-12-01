'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="glass-effect border-b border-dark-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">Becometry</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-accent-purple'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className={`text-sm font-semibold transition-colors ${
                isActive('/explore')
                  ? 'text-accent-purple'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Explore
            </Link>

            <Link
              href="/shorts"
              className={`text-sm font-semibold transition-colors ${
                isActive('/shorts')
                  ? 'text-accent-purple'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Videos
            </Link>

            {isAuthenticated && (
              <Link
                href="/favorites"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/favorites')
                    ? 'text-accent-purple'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Favorites
              </Link>
            )}

            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors ${
                isActive('/about')
                  ? 'text-accent-purple'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              About
            </Link>

            <Link
              href="/faq"
              className={`text-sm font-semibold transition-colors ${
                isActive('/faq')
                  ? 'text-accent-purple'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/apply"
              className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl text-sm font-semibold hover:shadow-glow transition-all"
            >
              Apply
            </Link>

            {/* Show Login/Register or User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 glass-effect border border-dark-700 rounded-xl hover:bg-dark-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-dark-200 text-sm font-semibold hidden sm:block">{user.name}</span>
                  <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-effect border border-dark-700 rounded-xl shadow-lg overflow-hidden">
                    <Link
                      href="/favorites"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-accent-purple transition-colors"
                    >
                      My Favorites
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-dark-300 hover:bg-dark-800 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-dark-400 hover:text-dark-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-dark-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pt-4 border-t border-dark-800 space-y-2">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/explore') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/shorts"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/shorts') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              Videos
            </Link>
            {isAuthenticated && (
              <Link
                href="/favorites"
                onClick={() => setShowMobileMenu(false)}
                className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/favorites') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
                }`}
              >
                Favorites
              </Link>
            )}
            <Link
              href="/about"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/about') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              About
            </Link>
            <Link
              href="/faq"
              onClick={() => setShowMobileMenu(false)}
              className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/faq') ? 'bg-accent-purple/20 text-accent-purple' : 'text-dark-400 hover:bg-dark-800'
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/apply"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-purple to-accent-blue text-white hover:shadow-glow transition-all text-center"
            >
              Apply
            </Link>

            {!isAuthenticated && (
              <div className="pt-2 border-t border-dark-800 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-semibold text-dark-400 hover:bg-dark-800 transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-purple to-accent-blue text-white hover:shadow-glow transition-all text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
