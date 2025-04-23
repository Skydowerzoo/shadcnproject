import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.mjs';
import router from './routes/routes.mjs';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Monte toutes les routes sous /api
app.use('/api', router);

// Log chaque requête (pour debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});