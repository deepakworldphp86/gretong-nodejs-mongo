// sliderController.js
const { sliderModel, sliderImageModel } = require('../models/sliderModel'); // Adjust the path as needed

// Slider Controllers

// Get all sliders with pagination
const getAllSliders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await sliderModel.paginate({}, { page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single slider by ID
const getSliderById = async (req, res) => {
  try {
    const slider = await sliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new slider
const createSlider = async (req, res) => {
  try {
    const slider = new sliderModel(req.body);
    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing slider
const updateSlider = async (req, res) => {
  try {
    const slider = await sliderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a slider
const deleteSlider = async (req, res) => {
  try {
    const result = await sliderModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Slider not found' });
    res.json({ message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Slider Image Controllers

// Get all slider images with pagination
const getAllSliderImages = async (req, res) => {
  const { page = 1, limit = 10, sliderId } = req.query;
  try {
    const query = sliderId ? { sliderId } : {};
    const result = await sliderImageModel.paginate(query, { page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single slider image by ID
const getSliderImageById = async (req, res) => {
  try {
    const sliderImage = await sliderImageModel.findById(req.params.id);
    if (!sliderImage) return res.status(404).json({ message: 'Slider image not found' });
    res.json(sliderImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new slider image
const createSliderImage = async (req, res) => {
  try {
    const sliderImage = new sliderImageModel(req.body);
    await sliderImage.save();
    res.status(201).json(sliderImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing slider image
const updateSliderImage = async (req, res) => {
  try {
    const sliderImage = await sliderImageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sliderImage) return res.status(404).json({ message: 'Slider image not found' });
    res.json(sliderImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a slider image
const deleteSliderImage = async (req, res) => {
  try {
    const result = await sliderImageModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Slider image not found' });
    res.json({ message: 'Slider image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
  getAllSliderImages,
  getSliderImageById,
  createSliderImage,
  updateSliderImage,
  deleteSliderImage,
};
