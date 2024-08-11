const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('../controllers/productRestApiController');

// Create a new product
router.post('/', createProduct);

// Get all products with pagination
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProductById);

// Delete a product by ID
router.delete('/:id', deleteProductById);

module.exports = router;
