const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath+"/middlewares/middlewareAdmin");
const quizAdminQuestionAnswerController = require('../controllers/quizAdminQuestionAnswerController.js');

// Quiz Routes
router.get("/list/:quizId/:page",mBackend.isAuthorized,quizAdminQuestionAnswerController.getQuizQuestionListing);
router.get("/edit/:id", mBackend.isAuthorized,quizAdminQuestionAnswerController.editQuizQuestion);
router.get("/add/:quizId",mBackend.isAuthorized,quizAdminQuestionAnswerController.addQuizQuestion);
router.post("/update/:id",quizAdminQuestionAnswerController.updateQuizQuestion);
router.post("/save",  quizAdminQuestionAnswerController.saveQuizQuestion);
router.get("/delete", quizAdminQuestionAnswerController.deleteQuizQuestion);

module.exports = router;
