# SinglePost

A simple web application that allows users to create and share one post **without registration or account creation**. The application uses IP address tracking to ensure each user can only create one post.

## Features

- **No Registration Required** — Start posting immediately without signing up
- **IP-Based Tracking** — One post per IP address to maintain simplicity
- **Rate Limiting** — Protection against spam and abuse
- **Clean & Simple UI** — Straightforward user interface
- **Fast & Lightweight** — Quick load times and responsive performance

## Technologies

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Security:** CORS, Rate Limiting, Cookie Parsing

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- MySQL database

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd onething
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the `backend` folder (see [Environment Variables](#environment-variables))

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run build

   # Run database migrations (if any)
   npx prisma migrate deploy
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:8376`

6. **Open the frontend**
   - Navigate to the `frontend` folder and open `index.html` in your browser, or
   - Set up a simple HTTP server for the frontend

## Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
DATABASE_URL=mysql://username:password@localhost:3306/onething_db
PORT=8376
NODE_ENV=development
```

**Note:** Replace `username`, `password`, and database name with your actual MySQL credentials.

## Project Structure

```
singlepost/
├── backend/
│   ├── prisma/              # Database schema and migrations
│   ├── middlewares/         # Express middlewares (validation, auth)
│   ├── generated/           # Auto-generated Prisma client
│   ├── server.ts            # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                 # Environment variables (not in repo)
│
└── frontend/
    ├── index.html           # Main page
    ├── design.html          # Design/prototype page
    ├── script.js            # Client-side logic
    └── styles/              # CSS stylesheets
```
