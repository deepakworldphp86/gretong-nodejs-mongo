const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const quizAdminOptionsController = require('../controllers/quizAdminOptionsController.js');

// Quiz Routes
router.get("/list/:quizId/:page",mBackend.isAuthorized,quizAdminOptionsController.getQuizOptionsListing);
router.get("/edit/:id", mBackend.isAuthorized,quizAdminOptionsController.editQuizOptions);
router.get("/add/:quizId",mBackend.isAuthorized,quizAdminOptionsController.addQuizOptions);
router.post("/update/:id",quizAdminOptionsController.updateQuizOptions);
router.post("/save",  quizAdminOptionsController.saveQuizOptions);
router.get("/delete/:quizId/:_id", quizAdminOptionsController.deleteQuizOptions);

module.exports = router;
