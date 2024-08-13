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
    status: {
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

const quizModel = mongoose.model("quizModel", quizSchema);

quizModel.paginate().then({}); // Usage

// Define schema
var quizOptionsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    quizId: {
      type: String, 
      required: true,
    },
    question:{
      type: String,
      trim: true,
    },
    options: [{
      type: String,
      trim: true,
    }],
    correctOptions:[{
      type: String,
      trim: true,
    }],
    points:{
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: false,
    },
    updateRequired: {
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
  },
  { strict: false }
);



var quizOptionsSchema = mongoose.Schema(quizOptionsSchema);

quizOptionsSchema.plugin(mongoosePaginate);

var quizOptionsModel = mongoose.model("quizOptionsModel", quizOptionsSchema);

quizOptionsModel.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  quizModel,
  quizOptionsModel,
  quizSchema,
  quizOptionsSchema,
};
