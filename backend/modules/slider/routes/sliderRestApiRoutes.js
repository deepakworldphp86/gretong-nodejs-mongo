// sliderRoutes.js
const express = require('express');
const router = express.Router();
const sliderRestController = require('../controllers/sliderRestController'); // Adjust path as necessary

// Slider Routes
router.get('/sliders', sliderRestController.getAllSliders);
router.get('/sliders/:id', sliderRestController.getSliderById);
router.post('/sliders', sliderRestController.createSlider);
router.put('/sliders/:id', sliderRestController.updateSlider);
router.delete('/sliders/:id', sliderRestController.deleteSlider);

// Slider Image Routes
router.get('/slider-images', sliderRestController.getAllSliderImages);
router.get('/slider-images/:id', sliderRestController.getSliderImageById);
router.post('/slider-images', sliderRestController.createSliderImage);
router.put('/slider-images/:id', sliderRestController.updateSliderImage);
router.delete('/slider-images/:id', sliderRestController.deleteSliderImage);

module.exports = router;
