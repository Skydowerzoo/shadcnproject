import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById, updateUserById } from '../models/user.mjs';
import { success, error } from '../utils/response.mjs';

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return error(res, 'Tous les champs requis ne sont pas remplis.', 400);
  }
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return error(res, 'Email déjà utilisé.', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = req.body.date || new Date().toISOString().split('T')[0];
    const newUser = await createUser(
      firstname,
      lastname,
      date,
      email,
      req.body.phone || null,
      hashedPassword,
      req.body.address || null,
      req.body.bio || null
    );
    return success(res, newUser, 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return error(res, 'Tous les champs sont requis.', 400);
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return error(res, 'Email ou mot de passe incorrect.', 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Email ou mot de passe incorrect.', 400);
    }
    // Incrémente login_count
    await import('../config/db.mjs').then(async ({ pool }) => {
      await pool.query('UPDATE users SET login_count = COALESCE(login_count,0) + 1 WHERE id = $1', [user.id]);
    });
    const token = jwt.sign({ id: user.id }, 'votre_secret_jwt', { expiresIn: '1h' });
    const { password: _, ...userWithoutPassword } = user;
    return success(res, { token, user: userWithoutPassword });
  } catch (err) {
    return error(res, err.message);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return error(res, 'Utilisateur non trouvé.', 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return success(res, userWithoutPassword);
  } catch (err) {
    return error(res, err.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      firstname,
      lastname,
      date,
      email,
      phone,
      password,
      address,
      bio
    } = req.body;
    const userData = {
      firstname,
      lastname,
      date,
      email,
      phone,
      address,
      bio
    };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }
    const updatedUser = await updateUserById(userId, userData);
    if (!updatedUser) {
      return error(res, 'Utilisateur introuvable.', 404);
    }
    const { password: _, ...userWithoutPassword } = updatedUser;
    return success(res, userWithoutPassword);
  } catch (err) {
    return error(res, 'Erreur serveur lors de la mise à jour.');
  }
};

export { registerUser, loginUser, getUser };