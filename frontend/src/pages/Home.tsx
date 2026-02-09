import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { blogService, categoryService, marketService } from '../services/api';
import type { Blog, Category, CryptoCoin } from '../types';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cryptoData, setCryptoData] = useState<CryptoCoin[]>([]);
    const [marketLoading, setMarketLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const categoryslug = searchParams.get('category') || '';

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const data = await marketService.getCryptoData();
                setCryptoData(data);
            } catch (err) {
                console.error("Failed to fetch market data", err);
            } finally {
                setMarketLoading(false);
            }
        };
        fetchMarketData();
    }, []);

    useEffect(() => {
        const fetchCategoriesAndBlogs = async () => {
            try {
                setLoading(true);
                const categoriesData = await categoryService.getAllCategories();
                setCategories(categoriesData);

                let categoryId = '';
                if (categoryslug) {
                    const matchedCategory = categoriesData.find((c: Category) => c.slug === categoryslug);
                    if (matchedCategory) {
                        categoryId = matchedCategory.id;
                    }
                }

                const blogsData = await blogService.getAllBlogs(categoryId ? { category_id: categoryId } : {});
                setBlogs(blogsData);

            } catch (error) {
                console.error('❌ Error fetching data:', error);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        fetchCategoriesAndBlogs();
    }, [categoryslug]);

    const handleCategoryClick = (slug: string) => {
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    };

    if (loading && isInitialLoad) {
        return <LoadingSpinner />;
    }

    const featuredBlog = blogs.find(blog => blog.position === 'featured') || blogs[0];

    const topStories = blogs.filter(blog => blog.position === 'top');
    // If no top stories marked, use the next 4 blogs after featured
    const displayTopStories = topStories.length > 0 ? topStories.slice(0, 4) : blogs.filter(b => b.id !== featuredBlog?.id).slice(0, 4);

    // Latest news is everything else
    const latestNews = blogs.filter(blog =>
        blog.id !== featuredBlog?.id &&
        !displayTopStories.find(ts => ts.id === blog.id)
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)]">

                <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-16 z-40 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar text-sm font-bold tracking-wide uppercase">
                            <button
                                onClick={() => handleCategoryClick('')}
                                className={`whitespace-nowrap transition-colors ${categoryslug === '' ? 'text-primary-600' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                All News
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className={`whitespace-nowrap transition-colors ${categoryslug === category.slug ? 'text-primary-600' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        <div className="hidden lg:block lg:col-span-3 space-y-6">
                            <h3 className="section-title text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-4">
                                Top Stories
                            </h3>
                            {topStories.map((blog) => (
                                <BlogCard key={blog.id} blog={blog} compact={true} />
                            ))}
                        </div>

                        <div className="lg:col-span-6">
                            {featuredBlog && categoryslug === '' && (
                                <div className="mb-10 group cursor-pointer">
                                    <Link to={`/blog/${featuredBlog.slug}`}>
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {featuredBlog.cover_image && (
                                                <img
                                                    src={featuredBlog.cover_image}
                                                    alt={featuredBlog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 sm:p-8">
                                                <span className="inline-block px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                                                    {featuredBlog.category.name}
                                                </span>
                                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">
                                                    {featuredBlog.title}
                                                </h1>
                                                <p className="text-gray-300 text-lg sm:max-w-2xl line-clamp-2">
                                                    {featuredBlog.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            <div className="space-y-8">
                                <h3 className="section-title text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-6">
                                    {categoryslug ? 'Filtered News' : 'Latest Analysis'}
                                </h3>

                                {blogs.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <p className="text-xl text-[var(--text-secondary)]">No updates in this section yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {(categoryslug ? blogs : latestNews).map((blog) => (
                                            <BlogCard key={blog.id} blog={blog} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <h3 className="section-title text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-4">
                                Market Pulse
                            </h3>
                            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-4">
                                {marketLoading ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : cryptoData.length > 0 ? (
                                    <div className="space-y-4">
                                        {cryptoData.map((coin) => (
                                            <div key={coin.id} className="flex justify-between items-center pb-2 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                                                <div className="flex items-center space-x-3">
                                                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                                    <div>
                                                        <p className="font-bold text-sm text-[var(--text-primary)]">{coin.name}</p>
                                                        <p className="text-xs text-[var(--text-secondary)] uppercase">{coin.symbol}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono text-sm font-bold text-[var(--text-primary)]">
                                                        ${coin.current_price.toLocaleString()}
                                                    </p>
                                                    <p className={`text-xs font-bold ${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[var(--text-secondary)] italic text-center py-4">
                                        Market data unavailable
                                    </p>
                                )}
                            </div>

                            <div className="lg:hidden mt-8">
                                <h3 className="section-title text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-4">
                                    Top Stories
                                </h3>
                                {topStories.map((blog) => (
                                    <BlogCard key={`mobile-${blog.id}`} blog={blog} compact={true} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Home;
