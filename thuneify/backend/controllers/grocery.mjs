import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  toggleProductChecked
} from '../models/grocery.mjs';

// Récupérer tous les produits
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};

// Récupérer un produit par son ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
  }
};

// Récupérer des produits par catégorie
export const getProductsInCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await getProductsByCategory(category);
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits par catégorie' });
  }
};

// Créer un nouveau produit (simplifié pour liste de courses)
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, image_url } = req.body;
    
    // Validation des champs obligatoires
    if (!name || !category) {
      return res.status(400).json({ error: 'Le nom et la catégorie sont obligatoires' });
    }
    
    const newProduct = await createProduct(name, description, category, image_url);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du produit' });
  }
};

// Mettre à jour un produit
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image_url, is_checked } = req.body;
    
    const updatedProduct = await updateProduct(id, { 
      name, 
      description, 
      category, 
      image_url,
      is_checked
    });
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du produit' });
  }
};

// Basculer l'état "coché" d'un produit
export const toggleChecked = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await toggleProductChecked(id);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors du basculement du statut du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors du basculement du statut' });
  }
};

// Supprimer un produit
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.status(200).json({ message: 'Produit supprimé avec succès', product: deletedProduct });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du produit' });
  }
};

// Rechercher des produits
export const searchForProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Requête de recherche manquante' });
    }
    
    const results = await searchProducts(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la recherche de produits' });
  }
};

