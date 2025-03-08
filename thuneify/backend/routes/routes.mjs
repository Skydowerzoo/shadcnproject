import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';
import { registerUser, loginUser, getUser, updateUser } from '../controllers/user.mjs';
import {
    getProducts,
    getProduct,
    getProductsInCategory,
    addProduct,
    updateProductById,
    removeProduct,
    searchForProducts,
    toggleChecked,
} from '../controllers/grocery.mjs';

const router = express.Router();

// Routes des dépenses
router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

// Routes utilisateurs - utilisez la fonction de contrôleur importée
router.post('/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);

// Routes pour la liste de courses (grocery)
router.get('/grocery', getProducts);
router.get('/grocery/search', searchForProducts);
router.get('/grocery/category/:category', getProductsInCategory);
router.get('/grocery/:id', getProduct);
router.post('/grocery', addProduct);
router.put('/grocery/:id', updateProductById);
router.patch('/grocery/:id/toggle', toggleChecked);
router.delete('/grocery/:id', removeProduct);

export default router;