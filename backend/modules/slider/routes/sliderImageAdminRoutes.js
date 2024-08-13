const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const sliderAdminOptionsController = require('../controllers/sliderImageController.js');

// Slider Routes
router.get("/list/:sliderId/:page",mBackend.isAuthorized,sliderAdminOptionsController.getSliderOptionsListing);
router.get("/edit/:id", mBackend.isAuthorized,sliderAdminOptionsController.editSliderOptions);
router.get("/add/:sliderId",mBackend.isAuthorized,sliderAdminOptionsController.addSliderOptions);
router.post("/update/:id",sliderAdminOptionsController.updateSliderOptions);
router.post("/save",  sliderAdminOptionsController.saveSliderOptions);
router.get("/delete/:sliderId/:_id", sliderAdminOptionsController.deleteSliderOptions);

module.exports = router;
