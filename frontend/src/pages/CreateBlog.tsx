import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService, categoryService } from '../services/api';
import RichTextEditor from '../components/editor/RichTextEditor';
import PageTransition from '../components/common/PageTransition';
import type { Category } from '../types';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category_id: '',
        cover_image: '',
        tags: '',
        position: 'standard',
    });
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setIsAdmin(user.role === 'ADMIN');
        }

        fetchCategories();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            console.log('Fetched categories:', data);
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please refresh the page.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.title || !formData.content || !formData.category_id) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const blogData = {
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt || formData.content.substring(0, 150),
                category_id: formData.category_id,
                cover_image: formData.cover_image || undefined,
                is_published: true,
                position: formData.position as 'featured' | 'top' | 'standard',
            };

            const blog = await blogService.createBlog(blogData);
            navigate(`/blog/${blog.slug}`);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to create blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)] py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-2">Create New Post</h1>
                            <p className="text-[var(--text-secondary)]">Share your thoughts with the world</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your blog title"
                                />
                            </div>

                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Excerpt (Short Description)
                                </label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    className="input-field resize-none h-20"
                                    placeholder="Brief description of your blog (optional)"
                                />
                            </div>

                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    required
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="input-field"
                                    disabled={categories.length === 0}
                                >
                                    <option value="">
                                        {categories.length === 0 ? 'Loading categories...' : 'Select a category'}
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {categories.length === 0 && (
                                    <p className="mt-2 text-sm text-amber-600">
                                        No categories found. Please make sure you've run the database migration with sample data.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="cover_image" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Cover Image URL
                                </label>
                                <input
                                    id="cover_image"
                                    name="cover_image"
                                    type="url"
                                    value={formData.cover_image}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://example.com/image.jpg (optional)"
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    {formData.content.length} characters
                                </p>
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
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Publishing...
                                        </span>
                                    ) : (
                                        'Publish Post'
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

export default CreateBlog;
