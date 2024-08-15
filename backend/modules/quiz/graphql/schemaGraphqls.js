// schema.js
const { gql } = require('apollo-server-express');

// Define your schema
const typeDefs = gql`
  # Define the Quiz type
  type Quiz {
    id: ID
    name: String
    code: String
    description: String
    difficulty: String
    quizImage: String
    totalQuestion: String
    status: String
    createdDate: String
    modifiedDate: String
    syncError: String
    magentoSyncStatus: String
    updateRequired: String
    storeId: String
  }

  # Define the QuizOption type
  type QuizOption {
    id: ID!
    quizId: String!
    question: String
    options: [String]
    correctOptions: [String]
    points: String
    status: String!
    storeId: String
    updateRequired: String
    createdDate: String
    modifiedDate: String
  }

  # Define the query type
  type Query {
    getQuiz(id: ID!): Quiz
    listQuizzes(page: Int, limit: Int): [Quiz]
    getQuizOption(id: ID!): QuizOption
    listQuizOptions(page: Int, limit: Int, quizId: String): [QuizOption]
  }

  # Define the mutation type
  type Mutation {
    createQuiz(
      name: String
      code: String
      description: String
      difficulty: String
      quizImage: String
      totalQuestion: String
      status: String
      syncError: String
      magentoSyncStatus: String
      updateRequired: String
      storeId: String
    ): Quiz

    updateQuiz(
      id: ID!
      name: String
      code: String
      description: String
      difficulty: String
      quizImage: String
      totalQuestion: String
      status: String
      syncError: String
      magentoSyncStatus: String
      updateRequired: String
      storeId: String
    ): Quiz

    deleteQuiz(id: ID!): Boolean

    createQuizOption(
      quizId: String!
      question: String
      options: [String]
      correctOptions: [String]
      points: String
      status: String!
      storeId: String
      updateRequired: String
    ): QuizOption

    updateQuizOption(
      id: ID!
      quizId: String
      question: String
      options: [String]
      correctOptions: [String]
      points: String
      status: String
      storeId: String
      updateRequired: String
    ): QuizOption

    deleteQuizOption(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
