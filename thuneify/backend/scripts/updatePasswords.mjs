import { pool } from '../config/db.mjs';
import bcrypt from 'bcrypt';

const updatePasswords = async () => {
  try {
    const result = await pool.query('SELECT id, password FROM users');
    const users = result.rows;

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
      console.log(`Mot de passe mis à jour pour l'utilisateur ID: ${user.id}`);
    }

    console.log('Tous les mots de passe ont été mis à jour.');
  } catch (err) {
    console.error('Erreur lors de la mise à jour des mots de passe:', err);
  } finally {
    pool.end();
  }
};

updatePasswords();