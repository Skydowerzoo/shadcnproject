import { pool } from '../config/db.mjs';

const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    console.log('Utilisateur trouvé dans la base de données:', user); // Ajoutez ce log
    return user;
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', err); // Ajoutez ce log
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    console.log('Utilisateur trouvé par ID dans la base de données:', user); // Ajoutez ce log
    return user;
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur par ID:', err); // Ajoutez ce log
    throw err;
  }
};

const createUser = async (firstname, lastname, date, email, phone, password, address, bio) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, date, email, phone, password, address, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [firstname, lastname, date, email, phone, password, address, bio]
    );
    const user = result.rows[0];
    console.log('Nouvel utilisateur créé:', user); // Ajoutez ce log
    return user;
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err); // Ajoutez ce log
    throw err;
  }
};

export { getUserByEmail, getUserById, createUser };