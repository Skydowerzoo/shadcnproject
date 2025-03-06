import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';
import { registerUser, loginUser, getUser, updateUser } from '../controllers/user.mjs';

const router = express.Router();

// Routes des dépenses
router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Routes utilisateur - CORRECTION ICI : /users/:id au lieu de /user/:id
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser); // Changement de /user/:id à /users/:id

export default router;