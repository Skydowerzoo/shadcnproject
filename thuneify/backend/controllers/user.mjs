import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById } from '../models/user.mjs';

const registerUser = async (req, res) => {
  const { firstname, lastname, date, email, phone, password, address, bio } = req.body;
  if (!firstname || !lastname || !date || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mot de passe haché:', hashedPassword); // Ajoutez ce log
    const newUser = await createUser(firstname, lastname, date, email, phone, hashedPassword, address, bio);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Requête de connexion reçue:', { email, password }); // Ajoutez ce log

  if (!email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const user = await getUserByEmail(email);
    console.log('Utilisateur trouvé:', user); // Ajoutez ce log
    if (!user) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Mot de passe correspond:', isMatch); // Ajoutez ce log
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ id: user.id }, 'votre_secret_jwt', { expiresIn: '1h' });
    res.status(200).json({ token: token, user: user });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err); // Ajoutez ce log
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err); // Ajoutez ce log
    res.status(500).json({ error: err.message });
  }
};

export { registerUser, loginUser, getUser };