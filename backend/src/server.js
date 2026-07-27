import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { setupSocket } from './config/socket.js';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const allowedOrigins = [
  "https://datingapp-heartlink.vercel.app", // Vercel frontend
  "http://localhost:3000"                   // Local dev (optional)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server calls
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for this origin"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(morgan('dev'));

connectDb();

app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Datingapp API is running',
    health: '/api/health',
    databaseHealth: '/api/health/db',
  });
});

const io = setupSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
