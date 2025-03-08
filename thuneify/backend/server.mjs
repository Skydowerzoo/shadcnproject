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

// Routes API - toutes regroupées dans le même fichier
app.use('/api', authRoutes);

// Ajout de logs pour le débogage
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Écoute sur le port défini (5000 par défaut)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});