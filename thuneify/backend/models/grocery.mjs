import { pool } from '../config/db.mjs';

// Récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const result = await pool.query('SELECT * FROM grocery_products ORDER BY id ASC');
    return result.rows;
  } catch (error) {
    console.error("Erreur dans getAllProducts:", error);
    throw error;
  }
};

// Récupérer un produit par son ID
export const getProductById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM grocery_products WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Erreur dans getProductById:", error);
    throw error;
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = async (category) => {
  try {
    const result = await pool.query('SELECT * FROM grocery_products WHERE category = $1', [category]);
    return result.rows;
  } catch (error) {
    console.error("Erreur dans getProductsByCategory:", error);
    throw error;
  }
};

// Créer un nouveau produit (simplifié pour liste de courses)
export const createProduct = async (name, description, category, image_url) => {
  try {
    const result = await pool.query(
      'INSERT INTO grocery_products (name, description, category, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, category, image_url]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erreur dans createProduct:", error);
    throw error;
  }
};

// Mettre à jour un produit
export const updateProduct = async (id, productData) => {
  try {
    const { name, description, category, image_url, is_checked } = productData;
    
    const result = await pool.query(
      'UPDATE grocery_products SET name = COALESCE($1, name), description = COALESCE($2, description), category = COALESCE($3, category), image_url = COALESCE($4, image_url), is_checked = COALESCE($5, is_checked) WHERE id = $6 RETURNING *',
      [name, description, category, image_url, is_checked, id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error("Erreur dans updateProduct:", error);
    throw error;
  }
};

// Basculer l'état "coché" d'un produit
export const toggleProductChecked = async (id) => {
  try {
    const result = await pool.query(
      'UPDATE grocery_products SET is_checked = NOT is_checked WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erreur dans toggleProductChecked:", error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (id) => {
  try {
    const result = await pool.query('DELETE FROM grocery_products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Erreur dans deleteProduct:", error);
    throw error;
  }
};

// Rechercher des produits
export const searchProducts = async (query) => {
  try {
    const searchQuery = `%${query}%`;
    const result = await pool.query(
      'SELECT * FROM grocery_products WHERE name ILIKE $1 OR description ILIKE $1',
      [searchQuery]
    );
    return result.rows;
  } catch (error) {
    console.error("Erreur dans searchProducts:", error);
    throw error;
  }
};
