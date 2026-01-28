# Blog CMS

A minimal, modern blog content management system built with Next.js 15 and SQLite.

## Features

- **Markdown Editor** - Write posts with live preview and syntax highlighting
- **Category Management** - Organize posts with categories
- **Full-text Search** - Search posts by title and content
- **Admin Dashboard** - Statistics and recent posts overview
- **Auto-save** - Never lose your work with 30-second auto-save
- **SEO Optimized** - Dynamic sitemap, robots.txt, and Open Graph tags
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite + Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/blog-cms.git
cd blog-cms

# Install dependencies
npm install

# Initialize database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── posts/        # Posts CRUD
│   │   ├── categories/   # Categories CRUD
│   │   └── search/       # Search endpoint
│   ├── admin/            # Admin dashboard
│   │   ├── posts/        # Post management
│   │   └── categories/   # Category management
│   ├── posts/[slug]/     # Post detail page
│   ├── categories/       # Category pages
│   └── search/           # Search results
├── components/
│   ├── admin/            # Admin components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   └── MarkdownRenderer.tsx
└── db/
    ├── schema.ts         # Database schema
    ├── index.ts          # Database connection
    └── seed.ts           # Seed data
```

## Screenshots

| Home | Post Detail |
|------|-------------|
| ![Home](screenshots/home.png) | ![Post](screenshots/post.png) |

| Admin Dashboard | Post Editor |
|-----------------|-------------|
| ![Admin](screenshots/admin.png) | ![Editor](screenshots/editor.png) |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Drizzle Studio |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (pagination, filter) |
| GET | `/api/posts/[slug]` | Get post by slug |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/[slug]` | Update post |
| DELETE | `/api/posts/[slug]` | Delete post |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/[id]` | Update category |
| DELETE | `/api/categories/[id]` | Delete category |
| GET | `/api/search?q=` | Search posts |

## License

MIT
