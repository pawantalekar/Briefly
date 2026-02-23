import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService, commentService, likeService } from '../services/api';
import MarkdownRenderer from '../components/blog/MarkdownRenderer';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Blog, Comment } from '../types';

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const articleRef = useRef<HTMLElement>(null);

    const fetchBlog = useCallback(async () => {
        try {
            setLoading(true);
            const data = await blogService.getBlogBySlug(slug!);
            setBlog(data);
            const commentsData = await commentService.getCommentsByBlog(data.id);
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching blog:', error);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        if (slug) fetchBlog();
    }, [slug, fetchBlog]);

    useEffect(() => {
        const handleScroll = () => {
            const el = articleRef.current;
            if (!el) return;
            const { top, height } = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrolled = Math.max(0, -top);
            const total = height - windowHeight;
            const progress = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
            setReadingProgress(progress);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLike = async () => {
        if (!blog) return;
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to like this blog');
            return;
        }
        try {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 600);
            await likeService.toggleLike(blog.id);
            setIsLiked(!isLiked);
            setBlog({
                ...blog,
                likes_count: isLiked ? blog.likes_count - 1 : blog.likes_count + 1,
            });
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blog || !commentText.trim()) return;
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to comment');
            return;
        }
        try {
            setSubmittingComment(true);
            const newComment = await commentService.createComment({
                blog_id: blog.id,
                content: commentText,
            });
            setComments([newComment, ...comments]);
            setCommentText('');
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const getReadingTime = (content: string) => {
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / 200);
    };

    if (loading) return <LoadingSpinner />;

    if (!blog) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-6">📄</div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4 font-serif">Article Not Found</h2>
                    <p className="text-[var(--text-secondary)] mb-8">The article you're looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="btn-primary">Go back home</Link>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            {/* Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out"
                style={{ width: `${readingProgress}%` }}
            />

            <div className="min-h-screen bg-[var(--bg-primary)]">

                {/* Cinematic Hero */}
                {blog.cover_image ? (
                    <div className="relative w-full h-[92vh] overflow-hidden">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover scale-105"
                            style={{ filter: 'brightness(0.45)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 max-w-4xl mx-auto">
                            <Link
                                to={`/category/${blog.category.slug}`}
                                className="inline-flex items-center px-3 py-1 mb-6 text-[10px] uppercase tracking-[0.2em] font-bold text-white border border-white/40 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all rounded-full"
                            >
                                {blog.category.name}
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-serif font-black text-white leading-[1.1] mb-8 drop-shadow-2xl">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-5">
                                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/30">
                                    {blog.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{blog.author.name}</p>
                                    <p className="text-white/60 text-xs">
                                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        &nbsp;·&nbsp;{getReadingTime(blog.content)} min read
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* No cover image — minimal header */
                    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                        <Link
                            to={`/category/${blog.category.slug}`}
                            className="inline-flex items-center px-3 py-1 mb-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-violet-500 hover:text-violet-500 transition-all rounded-full"
                        >
                            {blog.category.name}
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-serif font-black text-[var(--text-primary)] leading-[1.1] mb-8">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-5 pb-8 border-b border-[var(--border-color)]">
                            <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                                {blog.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] text-sm">{blog.author.name}</p>
                                <p className="text-[var(--text-secondary)] text-xs">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    &nbsp;·&nbsp;{getReadingTime(blog.content)} min read
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Body */}
                <article ref={articleRef} className="relative max-w-3xl mx-auto px-4 sm:px-8 py-16">

                    {/* Floating Stats bar (visible when there's a cover image) */}
                    {blog.cover_image && (
                        <div className="flex items-center justify-between mb-12 pb-8 border-b border-[var(--border-color)]">
                            <div className="flex items-center gap-4 text-[var(--text-secondary)] text-sm">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{blog.views_count} views</span>
                                </div>
                                <span>·</span>
                                <span>{getReadingTime(blog.content)} min read</span>
                            </div>
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${isLiked
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${isLikeAnimating ? 'scale-150' : 'scale-100'}`}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{blog.likes_count}</span>
                            </button>
                        </div>
                    )}

                    {/* No cover image — like button row */}
                    {!blog.cover_image && (
                        <div className="flex items-center justify-end mb-10">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 text-sm font-medium ${isLiked
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${isLikeAnimating ? 'scale-150' : 'scale-100'}`}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{blog.likes_count}</span>
                            </button>
                        </div>
                    )}

                    {/* Markdown Content */}
                    <div className="article-content mb-16">
                        <MarkdownRenderer content={blog.content} />
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-16 pt-10 border-t border-[var(--border-color)]">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-violet-400 hover:text-violet-500 transition-all cursor-default"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Author Card */}
                    <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-color)]">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-violet-500/20 flex-shrink-0">
                                {blog.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1">Written by</p>
                                <p className="text-xl font-bold font-serif text-[var(--text-primary)]">{blog.author.name}</p>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                    Published {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-8 text-[var(--text-primary)] flex items-center gap-3">
                            <span>Responses</span>
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-normal text-[var(--text-secondary)]">
                                {comments.length}
                            </span>
                        </h2>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-10">
                            <div className="relative">
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Share your thoughts on this article..."
                                    className="w-full px-5 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 resize-none h-32 transition-all duration-200 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    disabled={submittingComment}
                                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-full transition-all duration-200 disabled:opacity-50 shadow-md shadow-violet-500/20 hover:shadow-violet-500/40"
                                >
                                    {submittingComment ? 'Posting...' : 'Post Response'}
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-5">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex gap-4 p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-violet-400/30 transition-all duration-200"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold text-[var(--text-primary)] text-sm">{comment.user.name}</p>
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))}

                            {comments.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-5xl mb-4">💬</div>
                                    <p className="text-[var(--text-secondary)] font-medium">No responses yet</p>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </PageTransition>
    );
};

export default BlogDetail;
