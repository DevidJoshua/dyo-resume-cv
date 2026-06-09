# Devid Joshua - Personal Portfolio Website

Full-stack personal portfolio/resume website built with React, Node.js, Express, Prisma, and MySQL.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Backend:** Node.js, Express.js
- **Database:** MySQL with Prisma ORM
- **Authentication:** JWT-based admin authentication
- **Styling:** Custom CSS with dark mode support

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL Server
- npm or yarn

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE dyo;
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000` and proxy API requests to the backend at `http://localhost:5000`.

### Default Admin Credentials

- **Username:** devid_admin
- **Password:** admin123
- **Login URL:** http://localhost:3000/admin/login

## Project Structure

```
devid-porto/
├── backend/
│   ├── prisma/          # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/   # Auth, upload middleware
│   │   ├── routes/       # Express routes
│   │   └── index.js      # Server entry point
│   └── uploads/          # Uploaded images
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/   # React components
│       ├── contexts/     # Auth and Theme contexts
│       ├── pages/        # Page components
│       ├── services/     # API client
│       ├── types/        # TypeScript types
│       └── App.tsx       # Main app with routing
└── README.md
```

## Features

- Dynamic home page content managed via admin panel
- Skills management with categories and proficiency levels
- Portfolio management with CRUD operations
- Contact form with database storage
- Instagram section placeholder for future API integration
- Dark/light theme toggle with persistence
- Fully responsive design
- Admin dashboard with stats and message management

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/health | Health check | No |
| POST | /api/auth/login | Admin login | No |
| GET | /api/auth/me | Get current user | Yes |
| GET/PUT | /api/home | Home settings | PUT: Yes |
| GET | /api/skills | List skills | No |
| POST/PUT/DELETE | /api/skills/:id | Manage skills | Yes |
| GET | /api/portfolio | List portfolio | No |
| POST/PUT/DELETE | /api/portfolio/:id | Manage portfolio | Yes |
| GET | /api/contact | List messages | Yes |
| POST | /api/contact | Submit contact form | No |
| GET | /api/social | List social links | No |
| GET/PUT | /api/site | Site settings | PUT: Yes |
| GET | /api/site/dashboard | Admin dashboard data | Yes |
