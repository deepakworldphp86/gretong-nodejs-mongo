// resolvers.js
const { quizModel, quizOptionsModel } = require('../models/quizModel'); // Adjust path as necessary

const resolvers = {
  Query: {
    async getQuiz(_, { id }) {
      return await quizModel.findById(id);
    },
    async listQuizzes(_, { page = 1, limit = 10 }) {
      const result = await quizModel.paginate({}, { page, limit });
      return result.docs; // Assuming `paginate` returns an object with `docs` array
    },
    async getQuizOption(_, { id }) {
      return await quizOptionsModel.findById(id);
    },
    async listQuizOptions(_, { page = 1, limit = 10, quizId }) {
      const query = quizId ? { quizId } : {};
      const result = await quizOptionsModel.paginate(query, { page, limit });
      return result.docs; // Assuming `paginate` returns an object with `docs` array
    },
  },
  Mutation: {
    async createQuiz(_, args) {
      const quiz = new quizModel(args);
      return await quiz.save();
    },
    async updateQuiz(_, { id, ...updates }) {
      return await quizModel.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteQuiz(_, { id }) {
      const result = await quizModel.findByIdAndDelete(id);
      return !!result;
    },
    async createQuizOption(_, args) {
      const quizOption = new quizOptionsModel(args);
      return await quizOption.save();
    },
    async updateQuizOption(_, { id, ...updates }) {
      return await quizOptionsModel.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteQuizOption(_, { id }) {
      const result = await quizOptionsModel.findByIdAndDelete(id);
      return !!result;
    },
  },
};

module.exports = resolvers;
