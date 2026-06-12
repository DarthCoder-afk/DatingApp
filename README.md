# 💖 HeartLink – A Modern Dating Web App

**Developer:** Sean Michael A. Borje

**Live app:** [datingapp-heartlink.vercel.app](https://datingapp-heartlink.vercel.app)  
**API:** [heartlink-api-xhev.onrender.com](https://heartlink-api-xhev.onrender.com)

---

## 🧠 Overview

**HeartLink** is a full-stack dating web application that allows users to **register, discover, match, and chat** through a modern and responsive web interface.

Built with **Next.js**, **Express.js**, **Prisma**, **PostgreSQL**, and **Socket.io**, it emphasizes smooth functionality, strong authentication, and clean UI/UX design.

---

## 🚀 Core Features

### 🧍‍♂️ User Registration & Login
- Register with name, age, gender, bio, email, password, and profile photo
- Strong password validation (uppercase, lowercase, number, special character, min 8 chars)
- Show/hide password toggle
- JWT-based authentication

### 👤 Profile Management
- View and edit user details
- Update profile photo (uploaded to Cloudinary)

### 💞 User Discovery & Matching
- Browse user profiles
- Swipe right to like, left to pass
- Match forms when both users like each other
- Prevents showing duplicate profiles

### 🔍 Filters (Bonus Feature)
- Filter user discovery results by **age** and **gender**

### 💬 Messaging / Chat
- Chat becomes available after matching
- Send and receive messages between matched users
- Real-time messaging via **Socket.io**

### 🧭 Match List
- View all current matches
- Option to unmatch and remove chat access

---

## 🧩 Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4 + DaisyUI**
- **Framer Motion**
- **Lucide React** (icons)
- **React Hot Toast**
- **Socket.io Client**

### Backend
- **Node.js / Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Socket.io** (real-time chat)
- **Cloudinary** (profile photo storage)
- **Multer** (in-memory file uploads)
- **Dotenv** (environment configuration)

### Deployment
| Service  | Platform | Notes |
|----------|----------|-------|
| Frontend | Vercel   | Root directory: `frontend`, Node.js 20.x |
| Backend  | Render   | Root directory: `backend`, Node runtime |
| Database | Neon     | PostgreSQL 16, `sslmode=require` |

---

## 🧱 Project Structure

```
DatingApp/
├── docker-compose.yml   # Local Postgres + backend (Docker)
├── backend/
│   ├── prisma/          # Database schema and Prisma client
│   ├── src/
│   │   ├── config/      # DB, JWT, Cloudinary, Socket.io, Multer
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth middleware
│   │   └── routes/      # API routes
│   ├── Dockerfile       # Production container image
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── app/         # Next.js App Router pages
    │   ├── components/  # Reusable React components
    │   └── lib/         # API helpers
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20.9+** and npm
- PostgreSQL database (local, Docker, or [Neon](https://neon.tech))
- [Cloudinary](https://cloudinary.com) account (for profile photos)
- Git
- **Docker Desktop** (optional, for Docker Compose setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DarthCoder-afk/DatingApp.git
   cd DatingApp
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install

   cp .env.example .env
   # Edit .env with your DATABASE_URL, JWT_SECRET, and Cloudinary keys

   npx prisma generate
   npx prisma db push

   npm run dev
   ```
   Backend runs at `http://localhost:5000` by default.

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install

   cp .env.example .env.local
   # Edit .env.local (see Environment Variables below)

   npm run dev
   ```
   Frontend runs at `http://localhost:3000`.

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/heartlink"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
CLOUD_NAME=your-cloudinary-cloud
CLOUD_API_KEY=your-key
CLOUD_API_SECRET=your-secret
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

> Never commit `.env` or `.env.local` files. Use `.env.example` for placeholders only.

---

## 🐳 Docker (Local Development)

Run the **backend** and **PostgreSQL** in Docker while keeping the **frontend** on your machine (`npm run dev`). Secrets stay in `backend/.env` (gitignored); `docker-compose.yml` is safe to commit.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- `backend/.env` configured with `JWT_SECRET` and Cloudinary keys

### 1. Configure backend secrets

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your JWT and Cloudinary credentials. You do not need to set `DATABASE_URL` for Docker — Compose overrides it with the local Postgres service.

### 2. Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

### 3. Apply the database schema (first time only)

```bash
cd backend
DATABASE_URL="postgresql://heartlink:heartlink@localhost:5432/heartlink" npx prisma db push
```

### 4. Build and start the backend

```bash
cd ..
docker compose up --build backend
```

Add `-d` to run in the background: `docker compose up --build -d backend`.

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
```

If the database connection fails on the first attempt, wait a few seconds for Postgres to finish starting, then run:

```bash
docker compose restart backend
```

### 5. Start the frontend locally

In a separate terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev
```

Open **http://localhost:3000**.

### Docker commands

| Command | Purpose |
|---------|---------|
| `docker compose ps` | List running services |
| `docker compose logs -f backend` | Stream backend logs |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop services and delete database volume |
| `docker compose up --build` | Rebuild and start postgres + backend |

### Docker architecture (local)

```
Browser (localhost:3000)
  → Frontend (npm run dev on host)
  → Backend (Docker, localhost:5000)
  → PostgreSQL (Docker, localhost:5432)
  → Cloudinary (external)
```

### Docker troubleshooting

| Problem | Fix |
|---------|-----|
| Port `5432` already in use | Stop local Postgres or change the port mapping in `docker-compose.yml` |
| Port `5000` already in use | Change to `"5001:5000"` in compose and update frontend env vars |
| `Database connection failed` | Run `prisma db push`, then `docker compose restart backend` |
| Photo upload fails | Add valid Cloudinary keys to `backend/.env` and restart the backend |

---

## 🌐 Deployment

### Frontend (Vercel)
- **Root Directory:** `frontend`
- **Node.js Version:** 20.x
- **Environment variables:**
  ```env
  NEXT_PUBLIC_API_URL=https://heartlink-api-xhev.onrender.com/api
  NEXT_PUBLIC_SOCKET_URL=https://heartlink-api-xhev.onrender.com
  ```

### Backend (Render)
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install --include=dev && npx prisma generate`
- **Start Command:** `npm start`
- **Environment variables:** same as `backend/.env` (use Neon `DATABASE_URL` with `?sslmode=require`)

### Database (Neon)
1. Create a PostgreSQL project (v15–17; **16** recommended)
2. Copy the connection string
3. Apply schema once:
   ```bash
   cd backend
   npx prisma db push
   ```

### CORS
The backend allows requests from the Vercel frontend. Update `allowedOrigins` in `backend/src/server.js` and `backend/src/config/socket.js` if your production frontend URL changes.

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auths/register` — Register new user (multipart/form-data with photo)
- `POST /api/auths/login` — Login user

### Profile Management
- `GET /api/profiles/me` — Get current user's profile
- `GET /api/profiles/all` — Get all profiles
- `PUT /api/profiles/update` — Update profile (multipart/form-data with photo)

### Likes
- `POST /api/likes/:toUserId` — Send like to another user
- `GET /api/likes/sent` — View likes sent by the user
- `GET /api/likes/received` — View likes received by the user

### Matches
- `GET /api/matches/match` — Get user's matches
- `GET /api/matches/overview` — Get likes overview (sent/received/mutual)
- `DELETE /api/matches/:matchId` — Unmatch user

### Messages
- `GET /api/messages/conversations` — Get user's conversations
- `GET /api/messages/:matchId` — Get messages for a match
- `POST /api/messages/:matchId` — Send message in a match

### Pass
- `POST /api/passes/:toUserId` — Pass (reject) another user

All endpoints except `/api/auths/register` and `/api/auths/login` require the `Authorization: Bearer {token}` header.

---

## 🎯 Future Enhancements

1. **Real-time Features**
   - Live chat notifications
   - Online/offline status
   - Typing indicators

2. **Enhanced Matching**
   - Location-based matching
   - Interests and compatibility scoring
   - Advanced filters (height, education, etc.)

3. **Media Sharing**
   - Multiple profile photos
   - Photo sharing in chat
   - Voice messages

4. **Safety Features**
   - Profile verification
   - Report system
   - Block users

5. **Social Features**
   - Share profiles
   - Friend recommendations
   - Social media integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

Sean Michael A. Borje — seanmichaelborje179@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Socket.io](https://socket.io/)
- [Cloudinary](https://cloudinary.com/)
- [Render](https://render.com/)
- [Neon](https://neon.tech/)
- [Docker](https://www.docker.com/)
