# Briefly - Full-Stack Blog Platform

## Project Setup Complete! 🎉

### What's Been Built

A beautiful, modern blog platform with the following features:

#### Backend (Port 5000)
- ✅ **Authentication**: JWT-based auth with bcrypt password hashing
- ✅ **Blog Management**: Create, read, update posts with slug generation
- ✅ **Comments**: Nested comment system
- ✅ **Likes**: Like/unlike functionality with automatic count updates
- ✅ **Categories**: Organize blogs by categories
- ✅ **Database**: PostgreSQL (Supabase) with complete schema, triggers, and sample data

**Tech Stack**: Node.js, Express, TypeScript, Supabase, JWT, bcrypt, Joi validation

#### Frontend (Port 5173)
- ✅ **Home Page**: Beautiful hero section, featured blog, category filters
- ✅ **Blog Detail**: Full content view with comments, likes, author info
- ✅ **Authentication Pages**: Login and Register with beautiful gradients
- ✅ **Dashboard**: User blog management with stats
- ✅ **Responsive Design**: Mobile-first, Tailwind CSS
- ✅ **Beautiful UI**: Custom gradient text, hover effects, smooth transitions

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios

### How to Run

#### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on: http://localhost:5000

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

#### 3. Database Setup
1. Go to Supabase dashboard
2. Run the SQL from `backend/database-schema.sql`
3. Update `backend/.env` with your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`

### Project Structure

```
Briefly/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── blog/          # Blog CRUD operations
│   │   │   ├── comment/       # Comment system
│   │   │   ├── like/          # Like functionality
│   │   │   └── category/      # Category management
│   │   ├── middlewares/       # Auth & validation
│   │   ├── utils/             # Helpers
│   │   └── config/            # Configuration
│   └── database-schema.sql
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/        # Navbar, Footer
    │   │   └── blog/          # BlogCard
    │   ├── pages/             # Home, BlogDetail, Login, Register, Dashboard
    │   ├── services/          # API calls
    │   ├── types/             # TypeScript interfaces
    │   └── utils/             # Axios config
    └── tailwind.config.js
```

### Design System

**Colors**:
- Primary: Beautiful blue gradient (#3B82F6 to #1E40AF)
- Secondary: Purple & Pink accents
- Gradient Text: Primary to Purple to Pink

**Typography**:
- Headings: Inter (sans-serif)
- Body: Merriweather (serif)

**Components**:
- `btn-primary`: Primary button with gradient background
- `btn-secondary`: Outline button
- `card`: White card with shadow and border
- `input-field`: Styled form input
- `gradient-text`: Gradient text effect

### Key Features

1. **Beautiful Home Page**
   - Hero section with gradient background
   - Featured blog with large image
   - Category filter pills
   - Grid of blog cards with hover effects

2. **Blog Detail Page**
   - Full content display
   - Author information
   - View and like counts
   - Comments section
   - Tag display
   - Related posts (coming soon)

3. **Authentication**
   - Beautiful login/register forms
   - Form validation
   - Error handling
   - JWT token storage
   - Automatic token refresh

4. **Dashboard**
   - Stats cards (posts, views, likes)
   - Blog list with edit/delete buttons
   - Empty state with call-to-action
   - Responsive design

### Next Steps

1. ✅ Backend API is running
2. ✅ Frontend is running
3. ⏳ Set up Supabase database
4. ⏳ Create blog posts
5. ⏳ Test authentication flow
6. ⏳ Add create/edit blog functionality
7. ⏳ Deploy to production

### API Endpoints

**Auth**:
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get current user

**Blogs**:
- GET `/api/blogs` - Get all blogs (with filters)
- GET `/api/blogs/slug/:slug` - Get blog by slug
- POST `/api/blogs` - Create blog (auth required)
- PUT `/api/blogs/:id` - Update blog (auth required)
- DELETE `/api/blogs/:id` - Delete blog (auth required)

**Comments**:
- GET `/api/comments/blog/:blogId` - Get comments for blog
- POST `/api/comments` - Create comment (auth required)

**Likes**:
- POST `/api/likes/:blogId` - Toggle like (auth required)
- GET `/api/likes/:blogId/status` - Get like status

**Categories**:
- GET `/api/categories` - Get all categories

### Environment Variables

**Backend (.env)**:
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

**Frontend (.env)**:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Notes

- Frontend uses `access_token` in localStorage
- Backend uses JWT with 7-day expiry
- All passwords are hashed with bcrypt
- API responses follow standard format: `{ success: boolean, data: any, message?: string }`
- Axios interceptor handles token injection and 401 redirects
- Tailwind configured with custom primary colors

Enjoy building with Briefly! 🚀
