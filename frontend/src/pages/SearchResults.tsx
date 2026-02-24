import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { blogService } from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Blog } from '../types';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState(query);

    useEffect(() => {
        setInputValue(query);
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await blogService.searchBlogs(query);
                setResults(data);
            } catch {
                setError('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleNewSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Search Header */}
                    <div className="mb-8">
                        <form onSubmit={handleNewSearch} className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1 max-w-xl">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded outline-none focus:border-primary-500 transition-colors text-sm"
                                />
                            </div>
                            <button type="submit" className="btn-primary text-sm">
                                Search
                            </button>
                        </form>

                        {query && !loading && (
                            <div className="border-b border-[var(--border-color)] pb-4">
                                <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                                    {results.length > 0
                                        ? `${results.length} result${results.length !== 1 ? 's' : ''} for`
                                        : 'No results for'}
                                    {' '}
                                    <span className="text-[var(--text-primary)]">"{query}"</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* States */}
                    {loading && <LoadingSpinner />}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && query && results.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-12 h-12 mx-auto text-[var(--text-secondary)] mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <h2 className="text-xl font-serif font-bold text-[var(--text-primary)] mb-2">No articles found</h2>
                            <p className="text-[var(--text-secondary)] text-sm mb-6">
                                Try different keywords or browse all articles below.
                            </p>
                            <Link to="/" className="btn-primary text-sm">Browse All Articles</Link>
                        </div>
                    )}

                    {!loading && !error && !query && (
                        <div className="text-center py-20">
                            <p className="text-[var(--text-secondary)]">Enter a search term above to find articles.</p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!loading && results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map(blog => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default SearchResults;
