import pool from '../config/db.mjs';
import mongoose from 'mongoose';

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(100),
      lastname VARCHAR(100),
      date DATE,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20),
      password VARCHAR(255),
      address TEXT,
      bio TEXT
    )
  `;
  await pool.query(query);
};

const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Ajoutez d'autres champs si nécessaire
  });
  
  const User = mongoose.model('User', userSchema);
  
  const getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      console.log('Utilisateur trouvé dans la base de données:', user); // Ajoutez ce log
      return user;
    } catch (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', err); // Ajoutez ce log
      throw err;
    }
  };
  
  export { getUserByEmail };

const createUser = async (firstName, lastName, date, email, phone, password, address, bio) => {
  const query = `
    INSERT INTO users (firstname, lastname, date, email, phone, password, address, bio)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const result = await pool.query(query, [firstName, lastName, date, email, phone, password, address, bio]);
  return result.rows[0];
};

const updateUser = async (id, userData) => {
  const { firstName, lastName, date, email, phone, password, address, bio } = userData;
  const query = `
    UPDATE users
    SET firstname = $1, lastname = $2, date = $3, email = $4, phone = $5, password = $6, address = $7, bio = $8
    WHERE id = $9
    RETURNING *
  `;
  const result = await pool.query(query, [firstName, lastName, date, email, phone, password, address, bio, id]);
  return result.rows[0];
};

export { createUserTable, getUserById, getUserByEmail, createUser, updateUser };