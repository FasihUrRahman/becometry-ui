'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

type Page = 'dashboard' | 'categories' | 'subcategories' | 'profiles';

export default function AdminDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify auth
    const verifyAuth = async () => {
      try {
        await adminApi.verify();
        setLoading(false);
      } catch (error) {
        router.push('/admin/login');
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = () => {
    adminApi.logout();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] flex">
      {/* Sidebar */}
      <div className="w-[260px] h-screen sticky top-0 bg-[rgba(31,28,31,0.53)] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
        {/* Logo/Title */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)]">
          <h1 className="text-[24px] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Becometry
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-[12px] mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg text-[14px] transition-colors ${
                activePage === 'dashboard'
                  ? 'bg-white text-black font-medium'
                  : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActivePage('profiles')}
              className={`w-full text-left px-4 py-3 rounded-lg text-[14px] transition-colors ${
                activePage === 'profiles'
                  ? 'bg-white text-black font-medium'
                  : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              👤 Profiles
            </button>
            <button
              onClick={() => setActivePage('categories')}
              className={`w-full text-left px-4 py-3 rounded-lg text-[14px] transition-colors ${
                activePage === 'categories'
                  ? 'bg-white text-black font-medium'
                  : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              📁 Categories
            </button>
            <button
              onClick={() => setActivePage('subcategories')}
              className={`w-full text-left px-4 py-3 rounded-lg text-[14px] transition-colors ${
                activePage === 'subcategories'
                  ? 'bg-white text-black font-medium'
                  : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              📂 Sub-Categories
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.3)] rounded-lg text-[rgba(255,100,100,1)] text-[14px] hover:bg-[rgba(255,0,0,0.2)] transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <DashboardView />}
        {activePage === 'categories' && <CategoriesView />}
        {activePage === 'subcategories' && <SubcategoriesView />}
        {activePage === 'profiles' && <ProfilesView />}
      </div>
    </div>
  );
}

// Dashboard View Component
function DashboardView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-[28px] font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <div className="text-[rgba(255,255,255,0.6)] text-[12px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            TOTAL PROFILES
          </div>
          <div className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stats?.published_profiles || 0}
          </div>
        </div>

        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <div className="text-[rgba(255,255,255,0.6)] text-[12px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            TOTAL CATEGORIES
          </div>
          <div className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stats?.total_categories || 0}
          </div>
        </div>

        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <div className="text-[rgba(255,255,255,0.6)] text-[12px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            TOTAL SUB-CATEGORIES
          </div>
          <div className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stats?.total_subcategories || 0}
          </div>
        </div>

        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <div className="text-[rgba(255,255,255,0.6)] text-[12px] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            DRAFT PROFILES
          </div>
          <div className="text-white text-[32px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stats?.draft_profiles || 0}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Categories */}
        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <h3 className="text-white text-[18px] font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recently Added Categories
          </h3>
          <div className="space-y-3">
            {stats?.recentCategories?.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
                <span className="text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {cat.name}
                </span>
                <span className="text-[rgba(255,255,255,0.5)] text-[12px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {new Date(cat.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories by Profile Count */}
        <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
          <h3 className="text-white text-[18px] font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Top Categories by Profiles
          </h3>
          <div className="space-y-3">
            {stats?.topCategories?.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
                <span className="text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {cat.name}
                </span>
                <span className="bg-white text-black px-3 py-1 rounded-full text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {cat.profile_count} profiles
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Profiles */}
      <div className="mt-6 bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg p-6">
        <h3 className="text-white text-[18px] font-semibold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Recently Added Profiles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.recentProfiles?.map((profile: any) => (
            <div key={profile.id} className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.04)] rounded-lg">
              {profile.image_url && (
                <img
                  src={profile.image_url}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-[14px] font-medium truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {profile.name}
                </div>
                <div className="text-[rgba(255,255,255,0.5)] text-[12px] truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {profile.category_name || 'No category'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Categories View Component
function CategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, formData.name);
      } else {
        await adminApi.createCategory(formData.name);
      }
      setShowModal(false);
      setFormData({ name: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await adminApi.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Categories
        </h2>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-white text-black rounded-lg text-[14px] font-medium hover:bg-[rgba(255,255,255,0.9)] transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          + Add Category
        </button>
      </div>

      <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[rgba(255,255,255,0.02)]">
            <tr>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>ID</th>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>NAME</th>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>CREATED AT</th>
              <th className="text-right p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-[rgba(255,255,255,0.08)]">
                <td className="p-4 text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{category.id}</td>
                <td className="p-4 text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{category.name}</td>
                <td className="p-4 text-[rgba(255,255,255,0.6)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {new Date(category.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded text-[12px] hover:bg-[rgba(255,255,255,0.15)]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-4 py-2 bg-[rgba(255,0,0,0.1)] text-[rgba(255,100,100,1)] rounded text-[12px] hover:bg-[rgba(255,0,0,0.2)]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[rgba(31,28,31,0.95)] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 w-full max-w-md">
            <h3 className="text-white text-[20px] font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[14px]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white text-black rounded-lg text-[14px] font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcategories View Component
function SubcategoriesView() {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', category_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subcatsResponse, catsResponse] = await Promise.all([
        adminApi.getSubcategories(),
        adminApi.getCategories()
      ]);
      setSubcategories(subcatsResponse.data);
      setCategories(catsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await adminApi.updateSubcategory(editingSubcategory.id, formData.name, parseInt(formData.category_id));
      } else {
        await adminApi.createSubcategory(formData.name, parseInt(formData.category_id));
      }
      setShowModal(false);
      setFormData({ name: '', category_id: '' });
      setEditingSubcategory(null);
      fetchData();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleEdit = (subcategory: any) => {
    setEditingSubcategory(subcategory);
    setFormData({ name: subcategory.name, category_id: subcategory.category_id.toString() });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await adminApi.deleteSubcategory(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingSubcategory(null);
    setFormData({ name: '', category_id: '' });
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Sub-Categories
        </h2>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-white text-black rounded-lg text-[14px] font-medium hover:bg-[rgba(255,255,255,0.9)] transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          + Add Sub-Category
        </button>
      </div>

      <div className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[rgba(255,255,255,0.02)]">
            <tr>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>ID</th>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>NAME</th>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>CATEGORY</th>
              <th className="text-left p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>CREATED AT</th>
              <th className="text-right p-4 text-[rgba(255,255,255,0.6)] text-[12px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id} className="border-t border-[rgba(255,255,255,0.08)]">
                <td className="p-4 text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{subcategory.id}</td>
                <td className="p-4 text-white text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{subcategory.name}</td>
                <td className="p-4 text-[rgba(255,255,255,0.6)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {categories.find(c => c.id === subcategory.category_id)?.name || 'N/A'}
                </td>
                <td className="p-4 text-[rgba(255,255,255,0.6)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {new Date(subcategory.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(subcategory)}
                    className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded text-[12px] hover:bg-[rgba(255,255,255,0.15)]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory.id)}
                    className="px-4 py-2 bg-[rgba(255,0,0,0.1)] text-[rgba(255,100,100,1)] rounded text-[12px] hover:bg-[rgba(255,0,0,0.2)]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[rgba(31,28,31,0.95)] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 w-full max-w-md">
            <h3 className="text-white text-[20px] font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingSubcategory ? 'Edit Sub-Category' : 'Create Sub-Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[14px]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-white text-black rounded-lg text-[14px] font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {editingSubcategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Profiles View Component (with full CRUD including social links)
function ProfilesView() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Filters and Pagination
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    subcategory_ids: [] as number[],
    image_url: '',
    insight: '',
    notes: '',
    notes_url: '',
    location: '',
    language: 'English',
    status: 'draft',
    social_links: [] as { platform: string; url: string }[]
  });

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchData();
    }, filters.search ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [catsResponse, subcatsResponse] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getSubcategories()
      ]);
      setCategories(catsResponse.data);
      setSubcategories(subcatsResponse.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.category_id && filters.category_id !== '') {
        params.category_id = parseInt(filters.category_id);
      }

      if (filters.status && filters.status !== '') {
        params.status = filters.status;
      }

      const profilesResponse = await adminApi.getProfiles(params);
      setProfiles(profilesResponse.data.profiles || []);
      setPagination(prev => ({
        ...prev,
        total: profilesResponse.pagination?.total || 0,
        totalPages: profilesResponse.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload image first if there's a new file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary();
      }

      const profileData = {
        ...formData,
        image_url: imageUrl,
        category_id: parseInt(formData.category_id)
      };

      if (editingProfile) {
        await adminApi.updateProfile(editingProfile.id, profileData);
      } else {
        await adminApi.createProfile(profileData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      subcategory_ids: [],
      image_url: '',
      insight: '',
      notes: '',
      notes_url: '',
      location: '',
      language: 'English',
      status: 'draft',
      social_links: []
    });
    setEditingProfile(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name || '',
      category_id: profile.category_id ? String(profile.category_id) : '',
      subcategory_ids: profile.subcategories?.map((s: any) => s.id) || [],
      image_url: profile.image_url || '',
      insight: profile.insight || '',
      notes: profile.notes || '',
      notes_url: profile.notes_url || '',
      location: profile.location || '',
      language: profile.language || 'English',
      status: profile.status || 'draft',
      social_links: profile.social_links || []
    });
    setImagePreview(profile.image_url || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await adminApi.deleteProfile(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return formData.image_url;

    try {
      setUploadingImage(true);
      const result = await adminApi.uploadImage(imageFile);
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      social_links: [...formData.social_links, { platform: 'instagram', url: '' }]
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      social_links: formData.social_links.filter((_, i) => i !== index)
    });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...formData.social_links];
    updated[index][field] = value;
    setFormData({ ...formData, social_links: updated });
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setFormData({
      ...formData,
      subcategory_ids: formData.subcategory_ids.includes(subcategoryId)
        ? formData.subcategory_ids.filter(id => id !== subcategoryId)
        : [...formData.subcategory_ids, subcategoryId]
    });
  };

  const filteredSubcategories = subcategories.filter(
    sub => sub.category_id === parseInt(formData.category_id)
  );

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Profiles ({pagination.total})
        </h2>
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-white text-black rounded-lg text-[14px] font-medium hover:bg-[rgba(255,255,255,0.9)] transition-colors"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          + Add Profile
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white text-[13px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              placeholder="Search by name..."
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,0.4)] text-[14px]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>
          <div>
            <label className="block text-white text-[13px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Category</label>
            <select
              value={filters.category_id}
              onChange={(e) => {
                setFilters({ ...filters, category_id: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-[14px]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white text-[13px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Status</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPagination({ ...pagination, page: 1 });
              }}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-[14px]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Loading...
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          No profiles found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-[rgba(31,28,31,0.53)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-lg">
            {profile.image_url ? (
              <div className="relative h-56 w-full overflow-hidden bg-[rgba(0,0,0,0.3)]">
                <img src={profile.image_url} alt={profile.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-56 w-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center">
                <span className="text-[rgba(255,255,255,0.3)] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>No Image</span>
              </div>
            )}
            <div className="p-5">
              <h3 className="text-white text-[18px] font-semibold mb-2 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {profile.name}
              </h3>
              <p className="text-[rgba(255,255,255,0.5)] text-[13px] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {categories.find(c => c.id === profile.category_id)?.name || 'No category'}
              </p>
              {profile.location && (
                <p className="text-[rgba(255,255,255,0.4)] text-[12px] mb-4 flex items-center gap-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span>📍</span> {profile.location}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(profile)}
                  className="flex-1 px-4 py-2.5 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[13px] hover:bg-[rgba(255,255,255,0.15)] transition-colors font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="flex-1 px-4 py-2.5 bg-[rgba(255,0,0,0.1)] text-[rgba(255,100,100,1)] rounded-lg text-[13px] hover:bg-[rgba(255,0,0,0.2)] transition-colors font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[14px] hover:bg-[rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 4) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 6 + i;
                  } else {
                    pageNum = pagination.page - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination({ ...pagination, page: pageNum })}
                      className={`px-3 py-2 rounded-lg text-[14px] transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-white text-black'
                          : 'bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.15)]'
                      }`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[14px] hover:bg-[rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgba(31,28,31,0.95)] border border-[rgba(255,255,255,0.08)] rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white text-[20px] font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingProfile ? 'Edit Profile' : 'Create Profile'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory_ids: [] })}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {formData.category_id && filteredSubcategories.length > 0 && (
                  <div>
                    <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Sub-Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {filteredSubcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleSubcategory(sub.id)}
                          className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${
                            formData.subcategory_ids.includes(sub.id)
                              ? 'bg-white text-black'
                              : 'bg-[rgba(255,255,255,0.1)] text-white'
                          }`}
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Profile Image</label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)]">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                            setFormData({ ...formData, image_url: '' });
                          }}
                          className="absolute top-2 right-2 bg-[rgba(255,0,0,0.8)] text-white rounded-full p-2 text-[12px] hover:bg-[rgba(255,0,0,1)]"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.2)] transition-colors flex items-center justify-center gap-2"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          <span>📷</span>
                          <span>{imageFile ? imageFile.name : 'Choose image file'}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-[rgba(255,255,255,0.4)] text-[12px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Or paste image URL below
                    </div>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white placeholder-[rgba(255,255,255,0.3)]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Insight</label>
                  <textarea
                    value={formData.insight}
                    onChange={(e) => setFormData({ ...formData, insight: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white h-24"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Language</label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[14px] font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white text-[14px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Social Links</label>
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="px-3 py-1 bg-white text-black rounded text-[12px]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      + Add Link
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.social_links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="tiktok">TikTok</option>
                          <option value="facebook">Facebook</option>
                          <option value="website">Website</option>
                        </select>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="URL"
                          className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="px-3 py-2 bg-[rgba(255,0,0,0.1)] text-[rgba(255,100,100,1)] rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.1)] text-white rounded-lg text-[14px] disabled:opacity-50"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-3 bg-white text-black rounded-lg text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {uploadingImage ? 'Uploading...' : editingProfile ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
