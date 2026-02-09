import { useCallback, useEffect, useState } from 'react';
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
        if (slug) {
            fetchBlog();
        }
    }, [slug, fetchBlog]);

    const handleLike = async () => {
        if (!blog) return;

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please login to like this blog');
            return;
        }

        try {
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

        const token = localStorage.getItem('access_token');
        if (!token) {
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

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
                    <Link to="/" className="text-primary-600 hover:underline">
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)]">

                {blog.cover_image && (
                    <div className="relative h-96 bg-gray-900">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                )}


                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    <Link
                        to={`/category/${blog.category.slug}`}
                        className="inline-block px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--bg-primary)] transition mb-6"
                    >
                        {blog.category.name}
                    </Link>


                    <h1 className="text-4xl md:text-5xl font-serif font-black text-[var(--text-primary)] mb-6 leading-tight">
                        {blog.title}
                    </h1>


                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-color)]">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {blog.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] font-serif">{blog.author.name}</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {blog.updated_at && blog.updated_at !== blog.created_at ? (
                                        <>
                                            Updated {new Date(blog.updated_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </>
                                    ) : (
                                        new Date(blog.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 text-[var(--text-secondary)]">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{blog.views_count}</span>
                            </div>
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 transition ${isLiked ? 'text-red-500' : 'hover:text-red-500'
                                    }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={isLiked ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>{blog.likes_count}</span>
                            </button>
                        </div>
                    </div>


                    <div className="mb-12">
                        <MarkdownRenderer content={blog.content} />
                    </div>


                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-[var(--border-color)]">
                            {blog.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}


                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-8">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-[var(--text-primary)]">
                            Comments ({comments.length})
                        </h2>


                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="input-field resize-none h-32"
                                required
                            />
                            <button
                                type="submit"
                                disabled={submittingComment}
                                className="btn-primary mt-4"
                            >
                                {submittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>


                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-l-4 border-primary-500 pl-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <p className="font-semibold text-[var(--text-primary)]">
                                                    {comment.user.name}
                                                </p>
                                                <span className="text-sm text-[var(--text-secondary)]">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[var(--text-secondary)]">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {comments.length === 0 && (
                                <p className="text-center text-gray-500 py-8">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </PageTransition>
    );
};

export default BlogDetail;
