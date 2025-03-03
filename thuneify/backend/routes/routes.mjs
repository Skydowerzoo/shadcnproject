import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';
import { loginUser, getUser } from '../controllers/user.mjs';
import { getUserByEmail, createUser } from '../models/user.mjs';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Routes utilisateur
router.post('/login', loginUser);
router.get('/users/:id', getUser);

router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }
  
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Créer le nouvel utilisateur
      const newUser = await createUser(firstname, lastname, email, hashedPassword);
  
      res.status(201).json({ message: 'Compte créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
});

export default router;