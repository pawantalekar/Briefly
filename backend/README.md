# 🚀 Briefly Backend

Backend API for Briefly - A full-stack blog platform built with Node.js, Express, TypeScript, and Supabase.

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Dev Tools**: nodemon, ts-node

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── server.ts                      # Entry point
│   ├── config/
│   │   ├── config.ts                  # Environment configuration
│   │   └── supabaseClient.ts          # Supabase client instance
│   │
│   ├── modules/                       # Feature modules
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dao/
│   │   │   ├── schemas/
│   │   │   ├── models/
│   │   │   ├── domain/
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── blog/
│   │   ├── comment/
│   │   ├── like/
│   │   ├── category/
│   │   ├── tag/
│   │   └── analytics/
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.ts          # JWT verification
│   │   ├── errorHandler.ts            # Global error handling
│   │   └── validateSchema.ts          # Joi schema validation
│   │
│   ├── routes/
│   │   └── index.ts                   # Main router
│   │
│   └── shared/
│       ├── types/
│       └── utils/
│
├── .env                               # Environment variables
├── tsconfig.json
└── package.json
```

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 🗂️ Database Schema (Supabase)

### Required Tables:

#### `users`
```sql
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories`
```sql
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `blogs`
```sql
CREATE TABLE blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `comments`
```sql
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `likes`
```sql
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, blog_id)
);
```

---

## 🛣️ API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| POST | `/logout` | Logout user | Yes |

### Blogs (`/api/blogs`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all blogs | No |
| GET | `/:id` | Get blog by ID | No |
| GET | `/slug/:slug` | Get blog by slug | No |
| POST | `/` | Create blog | Yes |
| PUT | `/:id` | Update blog | Yes (Author) |
| DELETE | `/:id` | Delete blog | Yes (Author) |
| GET | `/my/blogs` | Get my blogs | Yes |

### Comments (`/api/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/blog/:blogId` | Get comments by blog | No |
| POST | `/` | Create comment | Yes |
| PUT | `/:id` | Update comment | Yes (Author) |
| DELETE | `/:id` | Delete comment | Yes (Author) |

### Likes (`/api/likes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats/:blogId` | Get like stats | No |
| POST | `/toggle` | Toggle like | Yes |

### Categories (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all categories | No |
| GET | `/:id` | Get category by ID | No |
| POST | `/` | Create category | Yes (Admin) |
| PUT | `/:id` | Update category | Yes (Admin) |
| DELETE | `/:id` | Delete category | Yes (Admin) |

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How to Use:

1. **Register/Login** to get a token
2. Include token in `Authorization` header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### Example Request:

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📐 Architecture Layers

### 1. **Routes**
- Define API endpoints
- Apply validation middleware
- Apply authentication middleware

### 2. **Controllers**
- Handle HTTP requests/responses
- Call service layer
- Return formatted responses

### 3. **Services**
- Business logic
- Data transformation
- Orchestrate DAO calls

### 4. **DAO (Data Access Object)**
- Direct database operations
- Supabase queries
- Error handling

### 5. **Models**
- TypeScript interfaces for database tables

### 6. **Domain (DTOs)**
- Data Transfer Objects
- Request/Response shapes

### 7. **Schemas**
- Joi validation schemas
- Input validation rules

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "OK",
  "message": "Briefly API is running",
  "timestamp": "2026-02-05T..."
}
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## 📝 Scripts

```json
{
  "dev": "nodemon src/server.ts",        // Development with hot reload
  "build": "tsc",                         // Compile TypeScript
  "start": "node dist/server.js"          // Production server
}
```

---

## 🔧 Next Steps

- [ ] Add tag module implementation
- [ ] Add analytics module
- [ ] Implement admin role middleware
- [ ] Add pagination helper
- [ ] Add file upload for images
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger)

---

## 📄 License

ISC

---

## 👨‍💻 Author

Built with ❤️ for Briefly
