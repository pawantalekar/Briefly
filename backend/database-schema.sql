-- ============================================
-- Briefly Database Schema for Supabase
-- PostgreSQL Database Setup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster slug lookups
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- 3. BLOGS TABLE
-- ============================================
CREATE TABLE blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);
CREATE INDEX idx_blogs_category_id ON blogs(category_id);
CREATE INDEX idx_blogs_is_published ON blogs(is_published);
CREATE INDEX idx_blogs_published_at ON blogs(published_at);

-- ============================================
-- 4. TAGS TABLE
-- ============================================
CREATE TABLE tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);

-- ============================================
-- 5. BLOG_TAGS TABLE (Junction Table)
-- ============================================
CREATE TABLE blog_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id, tag_id)
);

CREATE INDEX idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX idx_blog_tags_tag_id ON blog_tags(tag_id);

-- ============================================
-- 6. COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_blog_id ON comments(blog_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ============================================
-- 7. LIKES TABLE
-- ============================================
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, blog_id)
);

CREATE INDEX idx_likes_blog_id ON likes(blog_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- ============================================
-- 8. BLOG_VIEWS TABLE (For Analytics)
-- ============================================
CREATE TABLE blog_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX idx_blog_views_viewed_at ON blog_views(viewed_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO INCREMENT BLOG VIEWS
-- ============================================
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blogs
    SET views_count = views_count + 1
    WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION TO UPDATE BLOG LIKES COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs
        SET likes_count = likes_count + 1
        WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs
        SET likes_count = likes_count - 1
        WHERE id = OLD.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update likes_count
CREATE TRIGGER update_blog_likes_count_trigger
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_likes_count();

-- ============================================
-- INSERT SAMPLE DATA (Optional)
-- ============================================

-- Sample Categories
INSERT INTO categories (name, slug, description) VALUES
('Technology', 'technology', 'Articles about technology, programming, and software development'),
('Health', 'health', 'Health tips, fitness, and wellness articles'),
('Politics', 'politics', 'Political news and analysis'),
('Business', 'business', 'Business strategies and entrepreneurship'),
('Lifestyle', 'lifestyle', 'Lifestyle, travel, and personal development');

-- Sample Tags
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('React', 'react'),
('Node.js', 'nodejs'),
('TypeScript', 'typescript'),
('Fitness', 'fitness'),
('Nutrition', 'nutrition'),
('Elections', 'elections'),
('Economy', 'economy'),
('Startup', 'startup'),
('Travel', 'travel');

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- Enable if using Supabase Auth
-- ============================================

-- Enable RLS on tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize as needed)
/*
-- Users can read all published blogs
CREATE POLICY "Public blogs are viewable by everyone"
ON blogs FOR SELECT
USING (is_published = true);

-- Users can only update their own blogs
CREATE POLICY "Users can update own blogs"
ON blogs FOR UPDATE
USING (auth.uid() = author_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);
*/

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for blog statistics
CREATE OR REPLACE VIEW blog_statistics AS
SELECT 
    b.id,
    b.title,
    b.slug,
    b.views_count,
    b.likes_count,
    COUNT(DISTINCT c.id) as comments_count,
    b.published_at,
    u.name as author_name
FROM blogs b
LEFT JOIN comments c ON b.id = c.blog_id
LEFT JOIN users u ON b.author_id = u.id
WHERE b.is_published = true
GROUP BY b.id, b.title, b.slug, b.views_count, b.likes_count, b.published_at, u.name;

-- View for popular blogs (most viewed)
CREATE OR REPLACE VIEW popular_blogs AS
SELECT 
    b.id,
    b.title,
    b.slug,
    b.excerpt,
    b.cover_image,
    b.views_count,
    b.likes_count,
    b.published_at,
    c.name as category_name,
    u.name as author_name
FROM blogs b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN users u ON b.author_id = u.id
WHERE b.is_published = true
ORDER BY b.views_count DESC
LIMIT 10;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Full-text search index on blog content (PostgreSQL)
CREATE INDEX idx_blogs_title_search ON blogs USING gin(to_tsvector('english', title));
CREATE INDEX idx_blogs_content_search ON blogs USING gin(to_tsvector('english', content));

-- ============================================
-- COMPLETED!
-- ============================================

-- To verify all tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
