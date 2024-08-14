const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const sliderAdminImagesController = require('../controllers/sliderImageController.js');
const sliderHelper = require('../helpers/sliderHelpers.js')

// Slider Routes
router.get("/list/:sliderId/:page",mBackend.isAuthorized,sliderAdminImagesController.getSliderImagesListing);
router.get("/edit/:id", mBackend.isAuthorized,sliderAdminImagesController.editSliderImages);
router.get("/add/:sliderId",mBackend.isAuthorized,sliderAdminImagesController.addSliderImages);
router.post("/update/:id",sliderHelper.upload.single("childSliderImage"),sliderAdminImagesController.updateSliderImages);
router.post("/save",  sliderHelper.upload.single("childSliderImage"),sliderAdminImagesController.saveSliderImages);
router.get("/delete/:sliderId/:_id", sliderAdminImagesController.deleteSliderImages);

module.exports = router;
