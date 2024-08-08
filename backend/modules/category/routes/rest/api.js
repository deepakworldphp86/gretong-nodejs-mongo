const express = require('express');
const router = express.Router();
const { categoriesModel,schema } = require('../../models/category.model'); // Import the category model

// Create a new category
router.post('/', async (req, res) => {
  try {
    const category = new categoriesModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all categories with pagination
router.get('/', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    const categories = await categoriesModel.paginate({}, options);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await categoriesModel.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const category = await categoriesModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await categoriesModel.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
