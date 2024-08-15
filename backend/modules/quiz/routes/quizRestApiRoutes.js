// routes.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizRestController'); // Adjust path as necessary

// Quiz Routes
router.get('/quizzes', quizController.getAllQuizzes);
router.get('/quizzes/:id', quizController.getQuizById);
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.delete('/quizzes/:id', quizController.deleteQuiz);

// Quiz Option Routes
router.get('/quiz-options', quizController.getAllQuizOptions);
router.get('/quiz-options/:id', quizController.getQuizOptionById);
router.post('/quiz-options', quizController.createQuizOption);
router.put('/quiz-options/:id', quizController.updateQuizOption);
router.delete('/quiz-options/:id', quizController.deleteQuizOption);

module.exports = router;
