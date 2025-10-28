import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));


app.use('/api/auths', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});