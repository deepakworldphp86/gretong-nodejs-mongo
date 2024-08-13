// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

//Slider


var sliderSchema = new mongoose.Schema(
  {
    parentSliderId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    sliderImage: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    modifiedDate: {
      type: Date,
      default: Date.now,
    },
    syncError: {
      type: String,
      required: false,
      trim: true,
    },
    magentoSyncStatus: {
      type: String,
      required: false,
      trim: true,
    },
    updateRequired: {
      type: String,
      required: false,
      trim: true,
    },
    storeId: {
      type: String,
      required: false,
    },
  },
  { strict: false }
);

var sliderSchema = mongoose.Schema(sliderSchema);

sliderSchema.plugin(mongoosePaginate);

const sliderModel = mongoose.model("sliderModel", sliderSchema);

sliderModel.paginate().then({}); // Usage

// Define schema
var sliderImageSchema = new mongoose.Schema(
  {
    sliderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slider',
      required: true,
    },
    sliderTitle: {
      type: String,
      required: true,
      trim: true,
    },
    sliderImage: {
      type: String,
      required: true,
    },
    sliderText: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: false,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    modifiedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);



var sliderImageSchema = mongoose.Schema(sliderImageSchema);

sliderImageSchema.plugin(mongoosePaginate);

var sliderImageModel = mongoose.model("sliderImageModel", sliderImageSchema);

sliderImageModel.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  sliderModel,
  sliderImageModel,
  sliderSchema,
  sliderImageSchema,
};
