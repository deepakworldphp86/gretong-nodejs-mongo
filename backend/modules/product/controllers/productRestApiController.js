const { productModel } = require('../models/productModel.js'); // Import the product model

// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = new productModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all products with pagination
const getAllProducts = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    const products = await productModel.paginate({}, options);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product by ID
const updateProductById = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};