import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { blogService, categoryService } from '../services/api';
import type { Blog, Category } from '../types';

const Home = () => {
    const [searchParams] = useSearchParams();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [blogsData, categoriesData] = await Promise.all([
                blogService.getAllBlogs(selectedCategory ? { category_id: selectedCategory } : {}),
                categoryService.getAllCategories(),
            ]);
            setBlogs(blogsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('access_token'));
        };


        window.addEventListener('storage', handleStorageChange);


        window.addEventListener('focus', handleStorageChange);


        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, []);

    if (loading && isInitialLoad) {
        return <LoadingSpinner />;
    }

    return (
        <PageTransition>
            <div className="min-h-screen">

                <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Discover Stories That
                                <br />
                                <span className="text-yellow-300">Matter</span>
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                Explore insightful articles on technology, health, politics, and lifestyle.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register" className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                                    Start Reading
                                </Link>
                                <Link to="/categories" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition">
                                    Browse Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center space-x-4 overflow-x-auto">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === ''
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === category.id
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>


                {blogs.length > 0 && !selectedCategory && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h2 className="text-3xl font-bold mb-8">Featured Story</h2>
                        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg">
                            <div className="relative h-96 md:h-auto">
                                {blogs[0].cover_image ? (
                                    <img
                                        src={blogs[0].cover_image}
                                        alt={blogs[0].title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600" />
                                )}
                            </div>
                            <div className="p-8 flex flex-col justify-center">
                                <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full w-fit mb-4">
                                    {blogs[0].category.name}
                                </span>
                                <Link to={`/blog/${blogs[0].slug}`}>
                                    <h3 className="text-3xl font-bold mb-4 hover:text-primary-600 transition">
                                        {blogs[0].title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 mb-6 line-clamp-4">
                                    {blogs[0].excerpt || blogs[0].content.substring(0, 200) + '...'}
                                </p>
                                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                                    <span>{blogs[0].author.name}</span>
                                    <span>•</span>
                                    <span>{blogs[0].views_count} views</span>
                                    <span>•</span>
                                    <span>{blogs[0].likes_count} likes</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}


                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold mb-8">
                        {selectedCategory ? 'Filtered Posts' : 'Latest Posts'}
                    </h2>

                    {blogs.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xl text-gray-600">No blogs found in this category</p>
                        </div>
                    ) : (
                        <div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300"
                            style={{ opacity: loading ? 0.5 : 1 }}
                        >
                            {blogs.slice(selectedCategory || blogs.length > 1 ? 0 : 1).map((blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    )}
                </section>


                <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-16 mt-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
                        <p className="text-xl mb-8 text-white/90">
                            Join our community of writers and share your insights with the world.
                        </p>
                        {isAuthenticated ? (
                            <Link to="/create-blog" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                                Start Writing
                            </Link>
                        ) : (

                            <Link to="/register" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                                Create Free Account
                            </Link>
                        )}
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default Home;
