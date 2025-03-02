import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.mjs';
import authRoutes from './routes/routes.mjs';

const app = express();
const PORT = process.env.PORT || 5000;

// Connecter à la base de données
connectDB();

// Configurer CORS pour permettre les requêtes provenant de tous les domaines
app.use(cors());

app.use(bodyParser.json());
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});