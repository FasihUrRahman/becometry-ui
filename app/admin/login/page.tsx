'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminApi.login(credentials.username, credentials.password);

      if (response.success) {
        router.push('/admin/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Becometry Admin
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[8px] px-4 py-3 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-white transition-colors"
                placeholder="Enter your username"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[8px] px-4 py-3 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-white transition-colors"
                placeholder="Enter your password"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.3)] rounded-[8px] px-4 py-3">
                <p className="text-[rgba(255,100,100,1)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black rounded-[8px] px-6 py-3 font-medium text-[16px] hover:bg-[rgba(255,255,255,0.9)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-[rgba(255,255,255,0.4)] text-[12px] mt-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Default credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}
