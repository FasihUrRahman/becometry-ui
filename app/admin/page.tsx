'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submissionApi, Submission } from '@/lib/submissionApi';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // CSV Upload state
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, pagination.page]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await submissionApi.getAll({
        page: pagination.page,
        limit: 10,
        status: statusFilter || undefined,
      });
      setSubmissions(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await submissionApi.updateStatus(id, newStatus);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update submission status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch('http://localhost:5001/api/admin/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);

      if (result.success) {
        // Refresh submissions list
        fetchSubmissions();
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || 'Failed to upload CSV'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-dark-400">Manage profile submissions and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Pending', count: submissions.filter(s => s.status === 'pending').length, color: 'yellow' },
            { label: 'Approved', count: submissions.filter(s => s.status === 'approved').length, color: 'green' },
            { label: 'Rejected', count: submissions.filter(s => s.status === 'rejected').length, color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className="glass-effect rounded-2xl p-6">
              <div className={`text-${stat.color}-400 text-sm font-semibold uppercase tracking-wide mb-2`}>
                {stat.label}
              </div>
              <div className="text-4xl font-bold text-white">{stat.count}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="glass-effect rounded-2xl p-2 mb-6 inline-flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter === 'all' ? '' : filter);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all capitalize ${
                statusFilter === (filter === 'all' ? '' : filter)
                  ? 'bg-accent-purple text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Submissions Table */}
        {loading ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <div className="text-dark-400">Loading submissions...</div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <div className="text-dark-400">No submissions found</div>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-900/50 border-b border-dark-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Social Links</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Submitted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-dark-900/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{submission.name}</td>
                      <td className="px-6 py-4 text-dark-300">{submission.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-xs font-semibold">
                          {submission.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {submission.social_links?.slice(0, 3).map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-blue hover:text-accent-cyan text-xs capitalize"
                            >
                              {link.platform}
                            </a>
                          ))}
                          {submission.social_links && submission.social_links.length > 3 && (
                            <span className="text-dark-500 text-xs">
                              +{submission.social_links.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusBadgeColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-400 text-sm">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(submission.id, 'approved')}
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {submission.status !== 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(submission.id, 'pending')}
                              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-semibold hover:bg-yellow-500/30 transition-colors"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="border-t border-dark-800 p-6 flex justify-between items-center">
                <div className="text-dark-400 text-sm">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} submissions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 glass-effect rounded-lg text-dark-400 hover:text-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 glass-effect rounded-lg text-dark-400 hover:text-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link href="/explore" className="glass-effect rounded-2xl p-6 hover:bg-dark-900/50 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-purple transition-colors">
              View Profiles
            </h3>
            <p className="text-dark-400">Browse all published profiles</p>
          </Link>
          <button
            onClick={() => setShowCSVModal(true)}
            className="glass-effect rounded-2xl p-6 hover:bg-dark-900/50 transition-all group cursor-pointer text-left w-full"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-purple transition-colors">
              CSV Upload
            </h3>
            <p className="text-dark-400">Bulk upload profiles from CSV</p>
          </button>
        </div>

        {/* CSV Upload Modal */}
        {showCSVModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <div className="glass-effect rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Upload CSV</h2>
                <button
                  onClick={() => {
                    setShowCSVModal(false);
                    setCsvFile(null);
                    setUploadResult(null);
                  }}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">CSV Format Instructions</h3>
                <div className="glass-effect border border-dark-700 rounded-xl p-4 text-sm text-dark-300 space-y-2">
                  <p><strong className="text-white">Required columns:</strong> name, category</p>
                  <p><strong className="text-white">Optional columns:</strong> subcategory, image_url, insight, notes, notes_url, location, language, status, tags</p>
                  <p><strong className="text-white">Social links:</strong> youtube, twitter, linkedin, instagram, website, tiktok, facebook</p>
                  <p className="text-accent-purple">Note: Tags should be comma-separated. Categories/subcategories will be created if they don't exist.</p>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-300 mb-2">
                  Select CSV File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full glass-effect border border-dark-700 rounded-xl px-4 py-3 text-dark-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-purple file:text-white hover:file:bg-accent-purple/80 file:cursor-pointer"
                  />
                </div>
                {csvFile && (
                  <p className="mt-2 text-sm text-accent-purple">
                    Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleCSVUpload}
                disabled={!csvFile || uploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {uploading ? 'Uploading...' : 'Upload CSV'}
              </button>

              {/* Upload Result */}
              {uploadResult && (
                <div className={`p-4 rounded-xl border ${
                  uploadResult.success
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  <p className="font-semibold mb-2">{uploadResult.message}</p>
                  {uploadResult.data && (
                    <div className="text-sm space-y-1">
                      <p>✓ Success: {uploadResult.data.successCount} profiles created</p>
                      {uploadResult.data.errorCount > 0 && (
                        <p>✗ Errors: {uploadResult.data.errorCount} rows failed</p>
                      )}
                      {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
                        <div className="mt-3 max-h-40 overflow-y-auto">
                          <p className="font-semibold mb-1">Error Details:</p>
                          {uploadResult.data.errors.map((err: any, idx: number) => (
                            <p key={idx} className="text-xs">Row {err.row}: {err.error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
