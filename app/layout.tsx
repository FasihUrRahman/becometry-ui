'use client';

import './globals.css';
import CTAModal from '@/components/CTAModal';
import Preloader from '@/components/Preloader';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useEffect, useState } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { showCTA, setShowCTA } = useFavorites();

  return (
    <>
      {children}
      <CTAModal isOpen={showCTA} onClose={() => setShowCTA(false)} />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Becometry - Discover Creators, Mentors & Experts</title>
        <meta name="description" content="A curated directory of creators, mentors, and experts across various categories" />
      </head>
      <body suppressHydrationWarning>
        {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
        <AuthProvider>
          <FavoritesProvider>
            {mounted ? <LayoutContent>{children}</LayoutContent> : children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
