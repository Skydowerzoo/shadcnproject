import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';

const router = express.Router();

router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

export default router;