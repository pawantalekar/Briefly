import { useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Blog, UserModel } from '../types';

interface AdminStats {
    totalUsers: number;
    totalBlogs: number;
    totalComments: number;
    totalLikes: number;
}

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'blogs'>('overview');
    const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalBlogs: 0, totalComments: 0, totalLikes: 0 });
    const [users, setUsers] = useState<UserModel[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'blogs') {
            loadBlogs();
        }
    }, [activeTab]);

    const loadStats = async () => {
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBlogs = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllBlogs();
            setBlogs(data);
        } catch (error) {
            console.error('Error loading blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await adminService.deleteUser(userId);
            loadUsers();
            loadStats();
        } catch (error) {
            alert('Error deleting user' + error);
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await adminService.toggleUserStatus(userId, !currentStatus);
            loadUsers();
        } catch (error) {
            alert('Error updating user status' + error);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
        try {
            await adminService.updateUserRole(userId, newRole);
            loadUsers();
        } catch (error) {
            alert('Error updating user role' + error);
        }
    };

    const handleDeleteBlog = async (blogId: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            await adminService.deleteBlog(blogId);
            loadBlogs();
            loadStats();
        } catch (error) {
            alert('Error deleting blog' + error);
        }
    };

    const handleToggleBlogPublish = async (blogId: string, currentStatus: boolean) => {
        try {
            await adminService.toggleBlogPublish(blogId, !currentStatus);
            loadBlogs();
        } catch (error) {
            alert('Error updating blog status' + error);
        }
    };

    if (loading && activeTab === 'overview' && stats.totalUsers === 0) {
        return <LoadingSpinner />;
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                        <p className="text-gray-600">Manage users, blogs, and platform settings</p>
                    </div>


                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'overview'
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'users'
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Users
                                </button>
                                <button
                                    onClick={() => setActiveTab('blogs')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'blogs'
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Blogs
                                </button>
                            </nav>
                        </div>


                        {activeTab === 'overview' && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 rounded-lg">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold mb-1">{stats.totalUsers}</p>
                                        <p className="text-blue-100">Total Users</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 rounded-lg">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold mb-1">{stats.totalBlogs}</p>
                                        <p className="text-purple-100">Total Blogs</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 rounded-lg">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold mb-1">{stats.totalComments}</p>
                                        <p className="text-green-100">Total Comments</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 rounded-lg">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold mb-1">{stats.totalLikes}</p>
                                        <p className="text-pink-100">Total Likes</p>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === 'users' && (
                            <div className="p-6">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map(user => (
                                                    <tr key={user.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    {user.avatar_url ? (
                                                                        <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                                            <span className="text-primary-600 font-semibold">{user.name[0]}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleUpdateRole(user.id, e.target.value as 'USER' | 'ADMIN')}
                                                                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                                                            >
                                                                <option value="USER">User</option>
                                                                <option value="ADMIN">Admin</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                    }`}
                                                            >
                                                                {user.is_active ? 'Active' : 'Inactive'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'blogs' && (
                            <div className="p-6">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {blogs.map(blog => (
                                                    <tr key={blog.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900 max-w-md truncate">{blog.title}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.category.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleToggleBlogPublish(blog.id, blog.is_published)}
                                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.is_published
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                    }`}
                                                            >
                                                                {blog.is_published ? 'Published' : 'Draft'}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.views_count}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                            <a href={`/blog/${blog.slug}`} target="_blank" className="text-primary-600 hover:text-primary-900">
                                                                View
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteBlog(blog.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminPanel;
