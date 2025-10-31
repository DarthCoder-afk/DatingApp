# 💖 HeartLink – A Modern Dating Web App  

**Developer:** Sean Michael A. Borje  

---

## 🧠 Overview  

**HeartLink** is a full-stack dating web application that allows users to **register, discover, match, and chat** through a modern and responsive web interface.  

Built with **Next.js**, **Express.js**, **Prisma**, and **PostgreSQL**, it emphasizes smooth functionality, strong authentication, and clean UI/UX design.

---

## 🚀 Core Features  

### 🧍‍♂️ User Registration & Login  
- Register with name, age, gender, bio, email, password, and profile photo  
- Strong password validation (uppercase, lowercase, number, special character, min 8 chars)  
- Show/hide password toggle  
- JWT-based authentication  

### 👤 Profile Management  
- View and edit user details  
- Update profile photo  

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

### 🧭 Match List  
- View all current matches  
- Option to unmatch and remove chat access  

---

## 🧩 Tech Stack  

### Frontend  
- **Next.js 14 (App Router)**  
- **TypeScript**  
- **TailwindCSS + DaisyUI**  
- **Framer Motion**  
- **Lucide React (Icons)**  
- **React Hot Toast**

### Backend  
- **Node.js / Express.js**  
- **Prisma ORM**  
- **PostgreSQL**  
- **JWT Authentication**  
- **Multer** for file handling  
- **Dotenv** for environment configuration  

### Deployment  
- **Frontend:** Vercel  
- **Backend:** Railway  
- **Database:** PostgreSQL  

---

## 🧱 Project Structure  

```
backend/
├── prisma/          # Database schema and client
├── src/
│   ├── config/      # Configuration files (DB, JWT, etc.)
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware
│   └── routes/      # API routes
└── package.json     # Backend dependencies

frontend/
├── public/          # Static assets
├── src/
│   ├── app/        # Next.js pages and layouts
│   ├── components/ # Reusable React components
│   └── lib/        # Utility functions and API client
└── package.json    # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   https://github.com/DarthCoder-afk/DatingApp.git
   cd heartlink
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configurations
   cp .env.example .env
   
   # Set up the database
   npx prisma generate
   npx prisma db push
   
   # Start the development server
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local with your configurations
   cp .env.example .env.local
   
   # Start the development server
   npm run dev
   ```

4. **Environment Variables**

   Backend (.env):
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/heartlink"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   ```

   Frontend (.env.local):
   ```
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auths/register` - Register new user (multipart/form-data with photo)
- `POST /api/auths/login` - Login user

### Profile Management
- `GET /api/profiles/me` - Get current user's profile
- `GET /api/profiles/all` - Get all profiles
- `PUT /api/profiles/update` - Update profile (multipart/form-data with photo)

### Likes
- `POST /api/likes/:toUserId` - Send like to another user
- `GET /api/likes/sent` - View likes sent by the user
- `GET /api/likes/received` - View likes received by the user

### Matches
- `GET /api/matches/match` - Get user's matches
- `GET /api/matches/overview` - Get likes overview (sent/received/mutual)
- `DELETE /api/matches/:matchId` - Unmatch user

### Messages
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages/:matchId` - Send message in a match

### Pass
- `POST /api/passes/:toUserId` - Pass (reject) another user

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

Sean Michael A. Borje - seanmichaelborje179@gmail.com



---

## 🙏 Acknowledgments

* [Next.js](https://nextjs.org/)
* [Express.js](https://expressjs.com/)
* [Prisma](https://www.prisma.io/)
* [TailwindCSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
