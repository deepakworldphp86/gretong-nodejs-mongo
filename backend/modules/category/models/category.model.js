// load the things we need
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// define the schema for our category model with lowercase field names
const catSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
  externalId: {
    type: String,
    required: false,
  },
  storeId: {
    type: String,
    required: true,
  },
  updateRequired: {
    type: String,
    default: false,
  },
  categoryImage: {
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
});

var categorySchema = mongoose.Schema(catSchema);

categorySchema.plugin(mongoosePaginate);

const categories = mongoose.model("categories", categorySchema);

categories.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  categoriesModel: categories,
  schema: catSchema
};
