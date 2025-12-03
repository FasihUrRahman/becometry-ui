'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

        if (!token) {
          // No token, redirect to login
          router.replace('/admin/login');
          return;
        }

        // Verify the token with the API
        adminApi.setToken(token);
        const response = await adminApi.verify();
        const isValid = response.success;

        if (isValid) {
          // Valid token, redirect to dashboard
          router.replace('/admin/dashboard');
        } else {
          // Invalid token, clear it and redirect to login
          localStorage.removeItem('adminToken');
          router.replace('/admin/login');
        }
      } catch (error) {
        // Error verifying token, redirect to login
        console.error('Auth check error:', error);
        localStorage.removeItem('adminToken');
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-dark-400">Checking authentication...</p>
      </div>
    </div>
  );
}
