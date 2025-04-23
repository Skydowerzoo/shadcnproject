import { pool } from '../config/db.mjs';
import { success, error } from '../utils/response.mjs';

function validateGrocery({ name, category }) {
  if (!name || !category) {
    return 'Nom et catégorie sont requis.';
  }
  return null;
}

const getGroceries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grocery');
    return success(res, result.rows);
  } catch (err) {
    return error(res, err.message);
  }
};

const addGrocery = async (req, res) => {
  const validationError = validateGrocery(req.body);
  if (validationError) return error(res, validationError, 400);
  const { name, category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO grocery (name, category) VALUES ($1, $2) RETURNING *',
      [name, category]
    );
    return success(res, result.rows[0], 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const updateGrocery = async (req, res) => {
  const { id } = req.params;
  const validationError = validateGrocery(req.body);
  if (validationError) return error(res, validationError, 400);
  const { name, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE grocery SET name = $1, category = $2 WHERE id = $3 RETURNING *',
      [name, category, id]
    );
    if (result.rows.length === 0) {
      return error(res, 'Article non trouvé.', 404);
    }
    return success(res, result.rows[0]);
  } catch (err) {
    return error(res, err.message);
  }
};

const deleteGrocery = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM grocery WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return error(res, 'Article non trouvé.', 404);
    }
    return success(res, { message: 'Article supprimé avec succès.' });
  } catch (err) {
    return error(res, err.message);
  }
};

export { getGroceries, addGrocery, updateGrocery, deleteGrocery };

