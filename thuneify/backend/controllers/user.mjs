import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../models/user.mjs';

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
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ id: user.id }, 'votre_secret_jwt', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err); // Ajoutez ce log
    res.status(500).json({ error: err.message });
  }
};

export { loginUser };