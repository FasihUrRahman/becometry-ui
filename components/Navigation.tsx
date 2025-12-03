'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
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
              href="/apply"
              className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl text-sm font-semibold hover:shadow-glow transition-all"
            >
              Apply
            </Link>
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
              href="/apply"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-purple to-accent-blue text-white hover:shadow-glow transition-all text-center"
            >
              Apply
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
