import { pool } from '../config/db.mjs'; // Corrigez l'importation ici

// Récupérer toutes les dépenses
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter une nouvelle dépense
const addExpense = async (req, res) => {
  const { date, perso, commun } = req.body;
  if (!date || (!perso && !commun)) {
    return res.status(400).json({ error: 'Date et au moins un montant sont requis.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO expenses (date, perso, commun) VALUES ($1, $2, $3) RETURNING *',
      [date, perso, commun]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une dépense existante
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { date, perso, commun } = req.body;
  if (!date || (!perso && !commun)) {
    return res.status(400).json({ error: 'Date et au moins un montant sont requis.' });
  }
  try {
    const result = await pool.query(
      'UPDATE expenses SET date = $1, perso = $2, commun = $3 WHERE id = $4 RETURNING *',
      [date, perso, commun, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dépense non trouvée.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une dépense existante
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dépense non trouvée.' });
    }
    res.status(200).json({ message: 'Dépense supprimée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getExpenses, addExpense, updateExpense, deleteExpense };