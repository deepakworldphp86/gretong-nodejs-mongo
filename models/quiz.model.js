// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//Quiz

var quizSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   difficulty: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    total_question: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    created_date: {
      type: String,
      required: false,
    },
    modified_date: {
      type: String,
      required: false,
    },
    sync_error: {
      type: String,
      required: false,
    },
    magento_sync_status: {
      type: String,
      required: false,
    },
  },
  { strict: false }
);

var quizSchema = mongoose.Schema(quizSchema);

quizSchema.plugin(mongoosePaginate);

const Quiz = mongoose.model("Quiz", quizSchema);

Quiz.paginate().then({}); // Usage


// Define schema
var quizQuestionAnswerSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    correct_answer: {
      type: String,
      required: true,
    },
    incorrect_answers: {
      type: String,
      required: true,
    },
    options: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    created_date: {
      type: String,
      required: false,
    },
    modified_date: {
      type: String,
      required: false,
    },
  },
  { strict: false }
);

var quizQuestionAnswerSchema = mongoose.Schema(quizQuestionAnswerSchema);

quizQuestionAnswerSchema.plugin(mongoosePaginate);

const QuizQuestionAnswer = mongoose.model("QuizQuestionAnswer", quizQuestionAnswerSchema);

QuizQuestionAnswer.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  QuizModel: Quiz,
  QuizQuestionAnswerModel: QuizQuestionAnswer,
  quizSchema: quizSchema,
  quizQuestionAnswerSchema: quizQuestionAnswerSchema,
};
