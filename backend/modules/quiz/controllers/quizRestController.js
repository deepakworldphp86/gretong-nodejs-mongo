// quizController.js
const { quizModel, quizOptionsModel } = require('../models/quizModel'); // Adjust path as necessary

// Quiz Controllers

// Get all quizzes with pagination
const getAllQuizzes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await quizModel.paginate({}, { page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await quizModel.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const quiz = new quizModel(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await quizModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const result = await quizModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Quiz Option Controllers

// Get all quiz options with pagination
const getAllQuizOptions = async (req, res) => {
  const { page = 1, limit = 10, quizId } = req.query;
  try {
    const query = quizId ? { quizId } : {};
    const result = await quizOptionsModel.paginate(query, { page: parseInt(page), limit: parseInt(limit) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single quiz option by ID
const getQuizOptionById = async (req, res) => {
  try {
    const quizOption = await quizOptionsModel.findById(req.params.id);
    if (!quizOption) return res.status(404).json({ message: 'Quiz option not found' });
    res.json(quizOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new quiz option
const createQuizOption = async (req, res) => {
  try {
    const quizOption = new quizOptionsModel(req.body);
    await quizOption.save();
    res.status(201).json(quizOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing quiz option
const updateQuizOption = async (req, res) => {
  try {
    const quizOption = await quizOptionsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quizOption) return res.status(404).json({ message: 'Quiz option not found' });
    res.json(quizOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a quiz option
const deleteQuizOption = async (req, res) => {
  try {
    const result = await quizOptionsModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Quiz option not found' });
    res.json({ message: 'Quiz option deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizOptions,
  getQuizOptionById,
  createQuizOption,
  updateQuizOption,
  deleteQuizOption,
};
