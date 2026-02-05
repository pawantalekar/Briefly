import { Link } from 'react-router-dom';
import type { Blog } from '../../types';

interface BlogCardProps {
    blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <article className="blog-card group transform hover:-translate-y-1">
            {/* Cover Image */}
            {blog.cover_image ? (
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                            {blog.category.name}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="relative h-56 bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white text-primary-600 text-xs font-medium rounded-full">
                            {blog.category.name}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white px-8 text-center">{blog.title}</h3>
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <Link to={`/blog/${blog.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition line-clamp-2">
                        {blog.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                                {blog.author.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
                            <p className="text-xs text-gray-500">
                                {blog.updated_at && blog.updated_at !== blog.created_at
                                    ? `Updated ${formatDate(blog.updated_at)}`
                                    : formatDate(blog.published_at || blog.created_at)
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{blog.views_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{blog.likes_count}</span>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
