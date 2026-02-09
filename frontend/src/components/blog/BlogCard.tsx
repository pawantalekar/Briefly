import { Link } from 'react-router-dom';
import type { Blog } from '../../types';

interface BlogCardProps {
    blog: Blog;
    compact?: boolean;
}

const BlogCard = ({ blog, compact = false }: BlogCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (compact) {
        return (
            <article className="group flex gap-4 items-start py-4 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors px-2">
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1 block">
                        {blog.category.name}
                    </span>
                    <Link to={`/blog/${blog.slug}`}>
                        <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 font-serif">
                            {blog.title}
                        </h3>
                    </Link>
                    <div className="flex items-center text-xs text-[var(--text-secondary)] mt-2 space-x-2">
                        <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                </div>
                {blog.cover_image && (
                    <div className="w-24 h-16 flex-shrink-0">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </article>
        );
    }

    return (
        <article className="blog-card group h-full flex flex-col border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            {/* Cover Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                {blog.cover_image ? (
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 font-serif text-4xl">B.</span>
                    </div>
                )}
                <div className="absolute top-0 left-0">
                    <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest">
                        {blog.category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/blog/${blog.slug}`} className="block mb-3">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-primary-600 transition-colors font-serif line-clamp-2">
                        {blog.title}
                    </h2>
                </Link>

                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[var(--text-primary)] uppercase tracking-wide">
                            {blog.author.name}
                        </span>
                        <span>•</span>
                        <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{blog.views_count}</span>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
