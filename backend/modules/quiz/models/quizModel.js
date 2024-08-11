// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//Quiz

var quizSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
   difficulty: {
      type: String,
      required: false,
    },
    quizImage: {
      type: String,
      required: false,
    },
    totalQuestion: {
      type: String,
      required: false,
    },
    active: {
      type: String,
      required: false,
    },
    createdDate: {
      type: String,
      required: false,
    },
    modifiedDate: {
      type: String,
      required: false,
    },
    syncError: {
      type: String,
      required: false,
    },
    magentoSyncStatus: {
      type: String,
      required: false,
    },
    updateRequired: {
      type: String,
      required: false,
    },
    storeId: {
      type: String,
      required: false,
    },

  },
  { strict: false }
);

var quizSchema = mongoose.Schema(quizSchema);

quizSchema.plugin(mongoosePaginate);

const QuizModel = mongoose.model("QuizModel", quizSchema);

QuizModel.paginate().then({}); // Usage

// Define schema
var quizQuestionAnswerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId for referencing
      ref: 'QuizModel', // Reference to QuizModel
      required: true,
    },
    questions: [{
      type: String,
      trim: true,
    }],
    answers: [{
      type: String,
      trim: true,
    }],
    active: {
      type: String,
      required: true,
    },
    createdDate: {
      type: String,
      required: false,
    },
    modifiedDate: {
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
  QuizModel: QuizModel,
  QuizQuestionAnswerModel: QuizQuestionAnswer,
  quizSchema: quizSchema,
  quizQuestionAnswerSchema: quizQuestionAnswerSchema,
};
