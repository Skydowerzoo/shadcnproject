import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// CORRECTION: Importer updateUserById et pool
import { getUserByEmail, createUser, getUserById, updateUserById } from '../models/user.mjs';

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  // Suppression de date des champs requis
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Ajout d'une date par défaut
    const date = req.body.date || new Date().toISOString().split('T')[0];
    
    const newUser = await createUser(
      firstname, 
      lastname, 
      date,  // utilisez la date fournie ou la date actuelle
      email, 
      req.body.phone || null, 
      hashedPassword, 
      req.body.address || null, 
      req.body.bio || null
    );
    
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
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

    console.log("Tentative de mise à jour pour l'utilisateur:", userId);
    console.log("Données reçues:", req.body);

    // Solution plus simple : utiliser la fonction du modèle
    const userData = {
      firstname,
      lastname,
      date,
      email,
      phone,
      address,
      bio
    };

    // Gérer le mot de passe séparément
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }

    const updatedUser = await updateUserById(userId, userData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
  }
};

export { registerUser, loginUser, getUser };