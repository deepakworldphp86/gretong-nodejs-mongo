const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categoryRestApiController');

// Create a new category
router.post('/', createCategory);

// Get all categories with pagination
router.get('/', getAllCategories);

// Get a single category by ID
router.get('/:id', getCategoryById);

// Update a category by ID
router.put('/:id', updateCategoryById);

// Delete a category by ID
router.delete('/:id', deleteCategoryById);

module.exports = router;
