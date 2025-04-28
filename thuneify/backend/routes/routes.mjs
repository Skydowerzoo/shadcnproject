import express from 'express';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/expenses.mjs';
import { registerUser, loginUser, getUser, updateUser } from '../controllers/user.mjs';
import {
    getGroceries,
    addGrocery,
    updateGrocery,
    deleteGrocery
} from '../controllers/grocery.mjs';
import { pool } from '../config/db.mjs';
import { authenticate } from '../middleware/auth.mjs';
import { isAdmin } from '../middleware/isAdmin.mjs';

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
router.get('/grocery', getGroceries);
router.post('/grocery', addGrocery);
router.put('/grocery/:id', updateGrocery);
router.delete('/grocery/:id', deleteGrocery);

// Endpoint avancé pour dashboard admin
router.get('/api/admin/stats-advanced', authenticate, isAdmin, async (req, res) => {
  try {
    // Nombre total d'utilisateurs
    const users = await pool.query('SELECT COUNT(*) FROM users');
    // Connexions sur 30j
    const logins30d = await pool.query(
      "SELECT COALESCE(SUM(login_count),0) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"
    );
    // Inscriptions sur 30j
    const signups30d = await pool.query(
      "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"
    );
    // Dernière inscription
    const lastSignup = await pool.query(
      'SELECT created_at FROM users ORDER BY created_at DESC LIMIT 1'
    );
    // Top utilisateurs actifs
    const topUsers = await pool.query(
      'SELECT id, firstname, lastname, email, login_count FROM users ORDER BY login_count DESC LIMIT 5'
    );
    // Derniers inscrits
    const lastUsers = await pool.query(
      'SELECT id, firstname, lastname, email, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    // Graphique activité (30 derniers jours)
    const activityGraph = await pool.query(`
      SELECT
        to_char(d, 'DD/MM') as date,
        COALESCE(s.count, 0) as signups,
        COALESCE(l.count, 0) as logins
      FROM
        generate_series(NOW() - INTERVAL '29 days', NOW(), INTERVAL '1 day') AS d
      LEFT JOIN (
        SELECT date_trunc('day', created_at) as day, COUNT(*) as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
      ) s ON date_trunc('day', d) = s.day
      LEFT JOIN (
        SELECT date_trunc('day', created_at) as day, SUM(login_count) as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
      ) l ON date_trunc('day', d) = l.day
      ORDER BY d
    `);

    res.json({
      users: Number(users.rows[0].count),
      logins30d: Number(logins30d.rows[0].coalesce || 0),
      signups30d: Number(signups30d.rows[0].count),
      lastSignup: lastSignup.rows[0]?.created_at || null,
      topUsers: topUsers.rows,
      lastUsers: lastUsers.rows,
      activityGraph: activityGraph.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;