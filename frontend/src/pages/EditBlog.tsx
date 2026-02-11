import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService, categoryService } from '../services/api';
import RichTextEditor from '../components/editor/RichTextEditor';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Category } from '../types';

const EditBlog = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category_id: '',
        cover_image: '',
        position: 'standard',
    });
    const [updatedAt, setUpdatedAt] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchBlogAndCategories = useCallback(async () => {
        try {
            setLoading(true);
            const [blogData, categoriesData] = await Promise.all([
                blogService.getBlogById(id as string),
                categoryService.getAllCategories()
            ]);

            if (blogData) {
                setFormData({
                    title: blogData.title,
                    content: blogData.content,
                    excerpt: blogData.excerpt || '',
                    category_id: blogData.category.id,
                    cover_image: blogData.cover_image || '',
                    position: blogData.position || 'standard',
                });
                setUpdatedAt(blogData.updated_at);
            }
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Failed to load blog');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'ADMIN');

        fetchBlogAndCategories();
    }, [id, fetchBlogAndCategories, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!formData.title || !formData.content || !formData.category_id) {
            setError('Please fill in all required fields');
            setSubmitting(false);
            return;
        }

        try {
            const updateData = {
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt || formData.content.substring(0, 150),
                category_id: formData.category_id,
                cover_image: formData.cover_image || undefined,
                position: formData.position as 'featured' | 'top' | 'standard',
            };

            await blogService.updateBlog(id as string, updateData);

            navigate('/dashboard');
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to update blog. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)] py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Edit Blog Post</h1>
                            <p className="text-[var(--text-secondary)] mt-2">Update your blog content and settings</p>
                            {updatedAt && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Last updated: {new Date(updatedAt).toLocaleString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your blog title"
                                    required
                                />
                            </div>


                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Category *
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div>
                                <label htmlFor="cover_image" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Cover Image URL
                                </label>
                                <input
                                    type="url"
                                    id="cover_image"
                                    name="cover_image"
                                    value={formData.cover_image}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>


                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Excerpt
                                </label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-field resize-none"
                                    placeholder="Brief summary of your blog post (optional)"
                                />
                            </div>


                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Content *
                                </label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                />
                            </div>

                            {isAdmin && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                            Display Position
                                        </label>
                                        <select
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="standard">Standard (Feed)</option>
                                            <option value="top">Top Stories (Sidebar)</option>
                                            <option value="featured">Featured (Hero)</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Determine where this post appears on the home page.
                                        </p>
                                    </div>
                                </div>
                            )}


                            <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary"
                                >
                                    {submitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update Blog'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EditBlog;
