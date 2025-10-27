import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

app.use(cors());


app.use('/api/auths', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});