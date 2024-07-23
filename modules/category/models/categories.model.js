// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// define the schema for our user model
// User Form

catSchema = {
  Id: {
    type: String,
    required: true,
  },
  ParentId: {
    type: String,
    required: true,
  },
  Code: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Active: {
    type: String,
    required: true,
  },
  CreatedDate: {
    type: String,
    required: false,
  },
  ModifiedDate: {
    type: String,
    required: false,
  },
  ExternalId: {
    type: String,
    required: false,
  },
  StoreId: {
    type: String,
    required: true,
  },
  UpdateRequired: {
    type: String,
    required: true,
  },
  CategoryImage: {
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
};

var categoriesSchema = mongoose.Schema(catSchema);

categoriesSchema.plugin(mongoosePaginate);

const Categories = mongoose.model("Categories", categoriesSchema);

Categories.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  CategoriesModel: Categories,
  schema: catSchema
};
