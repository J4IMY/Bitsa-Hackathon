# BITSA Website

A modern, full-stack web application for the BITSA (Burundi Information Technology Student Association) community. Built with React, Express, and PostgreSQL.

![BITSA Logo](client/public/bitsa_logo.jpg)

## ✨ Features

### 🏠 Core Features
- **Home Page**: Welcome page with organization overview
- **Events Management**: Browse, register, and manage events
- **Blog System**: Read and publish blog posts
- **Photo Gallery**: Browse and view organization photos
- **Contact Page**: Get in touch with the organization
- **User Authentication**: Secure login and registration system

### 💬 Discussion Room
- **Create Discussions**: Start conversations with the community
- **Image Uploads**: Attach images to discussions and replies (up to 5MB)
- **Real-time Replies**: Engage in threaded conversations
- **Admin Moderation**: Admins can delete inappropriate content
- **Author Attribution**: See who posted each discussion and reply

### 🎯 Event Features
- **Event Registration**: One-click event registration for authenticated users
- **Attendee Tracking**: Real-time attendee count updates
- **Registration Management**: View and manage your registrations

### 🔐 Admin Features
- **Content Management**: Create and manage blog posts, events, and gallery images
- **User Management**: Admin dashboard for content moderation
- **Discussion Moderation**: Delete discussions and replies

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful UI components
- **Lucide React** - Icon library
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **Drizzle ORM** - Database toolkit
- **PostgreSQL** - Database
- **Passport.js** - Authentication
- **bcrypt** - Password hashing

### Development Tools
- **Vite** - Build tool and dev server
- **ESBuild** - JavaScript bundler
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd WebOutline
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/bitsa_db

# Session
SESSION_SECRET=your-super-secret-session-key-here

# Environment
NODE_ENV=development
```

**Generate a secure session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set Up the Database

Create your PostgreSQL database:
```bash
createdb bitsa_db
```

Run database migrations:
```bash
npm run db:push
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

## 📦 Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🗂️ Project Structure

```
WebOutline/
├── client/                  # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Page components
│   └── index.html
├── server/                  # Express backend
│   ├── routes/             # API routes
│   │   └── discussions.ts  # Discussion endpoints
│   ├── auth.ts             # Authentication logic
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # Main route registration
│   └── storage.ts          # Data access layer
├── shared/                  # Shared code
│   └── schema.ts           # Database schema & types
├── .replit                 # Replit configuration
├── drizzle.config.ts       # Drizzle ORM configuration
└── package.json
```

## 🌐 Deployment

The application is designed to be deployed as a **monolithic application** (frontend + backend together).

### Recommended Platforms

#### Option 1: Replit (Easiest)
1. Import project from GitHub
2. Add environment variables in Secrets
3. Click "Run"

#### Option 2: Render / Railway / Heroku
1. Connect GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### Important: Database Migrations

Run migrations **locally** pointing to your production database:

```bash
DATABASE_URL="your_production_database_url" npm run db:push
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔑 Admin Access

To create an admin user, manually update the database:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

## 🎨 Features Overview

### Discussion Room
- Create discussion topics
- Post replies with optional images
- View discussions by newest first
- Reply count indicators
- Admin moderation tools

### Event Management
- View upcoming events
- Register/unregister for events
- See attendee counts
- Event details with dates and locations

### Blog System
- Read published blog posts
- Rich text content
- Author information
- Publication dates

### Gallery
- Browse organization photos
- Grid layout
- Image descriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Image uploads are limited to 5MB (stored as base64)
- For larger images, consider using a CDN or cloud storage solution

## 🔮 Future Enhancements

- [ ] Image optimization and compression
- [ ] Email notifications for events
- [ ] Discussion categories/tags
- [ ] User profiles
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Mobile app

## 📞 Support

For questions or issues, please:
1. Check existing GitHub issues
2. Create a new issue with details
3. Contact the maintainers

---

**Built with ❤️ by the BITSA Community**
