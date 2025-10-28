import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import { connectDb } from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));


app.use('/api/auths', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/likes', likeRoutes );


connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 
