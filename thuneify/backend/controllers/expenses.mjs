import { pool } from '../config/db.mjs';
import { success, error } from '../utils/response.mjs';
import { z } from 'zod';

const expenseSchema = z.object({
  date: z.string(),
  perso: z.number().optional(),
  commun: z.number().optional(),
});

function validateExpense({ date, perso, commun }) {
  if (!date || (perso == null && commun == null)) {
    return 'Date et au moins un montant sont requis.';
  }
  return null;
}

const getExpenses = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return success(res, result.rows);
  } catch (err) {
    return error(res, err.message);
  }
};

const addExpense = async (req, res) => {
  const parse = expenseSchema.safeParse(req.body);
  if (!parse.success) return error(res, 'Entrée invalide: ' + parse.error.message, 400);
  const { date, perso, commun } = parse.data;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (date, perso, commun) VALUES ($1, $2, $3) RETURNING *',
      [date, perso, commun]
    );
    return success(res, result.rows[0], 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const parse = expenseSchema.safeParse(req.body);
  if (!parse.success) return error(res, 'Entrée invalide: ' + parse.error.message, 400);
  const { date, perso, commun } = parse.data;
  try {
    const result = await pool.query(
      'UPDATE expenses SET date = $1, perso = $2, commun = $3 WHERE id = $4 RETURNING *',
      [date, perso, commun, id]
    );
    if (result.rows.length === 0) {
      return error(res, 'Dépense non trouvée.', 404);
    }
    return success(res, result.rows[0]);
  } catch (err) {
    return error(res, err.message);
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return error(res, 'Dépense non trouvée.', 404);
    }
    return success(res, { message: 'Dépense supprimée avec succès.' });
  } catch (err) {
    return error(res, err.message);
  }
};

export { getExpenses, addExpense, updateExpense, deleteExpense };