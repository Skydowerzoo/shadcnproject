import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';
import { loginUser } from '../controllers/user.mjs';

const router = express.Router();

router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Routes utilisateur
router.post('/login', loginUser);

export default router;