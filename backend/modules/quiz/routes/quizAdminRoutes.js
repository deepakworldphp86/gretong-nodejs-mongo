const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const quizAdminController = require('../controllers/quizAdminController.js');
const quizHelper = require('../helpers/quizHelpers.js')

// Quiz Routes
router.get("/list/:page",mBackend.isAuthorized,quizAdminController.getQuizListing);
router.get("/edit/:Id", mBackend.isAuthorized,quizAdminController.editQuiz);
router.get("/add/:id",mBackend.isAuthorized,quizAdminController.addQuiz);
router.post("/update/:Id",quizHelper.upload.single("quizImage"),quizAdminController.updateQuiz);
router.post("/save", quizHelper.upload.single("quizImage"), quizAdminController.saveQuiz);
router.get("/delete", quizAdminController.deleteQuiz);

module.exports = router;
