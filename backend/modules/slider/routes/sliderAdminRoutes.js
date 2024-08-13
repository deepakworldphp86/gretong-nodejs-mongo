const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const sliderAdminController = require('../controllers/sliderAdminController.js');
const sliderHelper = require('../helpers/sliderHelpers.js')

// Slider Routes
router.get("/list/:page",mBackend.isAuthorized,sliderAdminController.getSliderListing);
router.get("/edit/:id", mBackend.isAuthorized,sliderAdminController.editSlider);
router.get("/add",mBackend.isAuthorized,sliderAdminController.addSlider);
router.post("/update/:id",sliderHelper.upload.single("sliderImage"),sliderAdminController.updateSlider);
router.post("/save", sliderHelper.upload.single("sliderImage"), sliderAdminController.saveSlider);
router.get("/delete/:sliderId/:_id", sliderAdminController.deleteSlider);

module.exports = router;
