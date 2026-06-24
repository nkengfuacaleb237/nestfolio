# Nestfolio — Property Listing Platform

A full-stack property listing web application built with React, Node.js, Express, and MongoDB. Users can register, list properties for rent or sale, manage their portfolio, and browse/search listings with dynamic filters.

**Live Demo:** https://nestfolio-nu.vercel.app/  
**Repository:** https://github.com/nkengfuacaleb237/nestfolio

---

## Features

- User registration and login with bcrypt-salted password hashing and JWT authentication
- Protected routes — unauthenticated users are redirected to login
- Create, edit, and delete property listings (Apartment, House, Studio)
- Public feed with city and price range search filters
- Private "My Listings" screen showing only the authenticated user's properties
- Account dashboard — update profile (username, phone, avatar) and change password
- Server-side ownership validation — non-authors receive 403 Forbidden on edit/delete
- Responsive UI built with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios (with global request interceptor) |

---

## Architecture

The backend follows a clean 3-layer architecture:

- **Routes** — define endpoints and apply auth middleware
- **Controllers** — handle business logic and validation
- **Repositories** — all direct database interactions

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/properties | Public |
| GET | /api/properties/:id | Public |
| POST | /api/properties | Private |
| PUT | /api/properties/:id | Private (owner only) |
| DELETE | /api/properties/:id | Private (owner only) |
| GET | /api/users/profile | Private |
| PUT | /api/users/profile | Private |
| PUT | /api/users/password | Private |

---

## Author

**Nkengfua Caleb Nkengafac**  
Student ID: LMUI-24SWE296  
Web Development Exam Project — 2026