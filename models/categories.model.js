// load the things we need
var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// define the schema for our user model
// User Schema
var categoriesSchema = mongoose.Schema({
  entity_id: {
    type: String,
    required: true,
  },
  Id: {
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
  ParentId: {
    type: String,
    required: true,
  },
  Active: {
    type: String,
    required: true,
  },
  CreatedDate: {
    type: String,
    required: true,
  },
  ModifiedDate: {
    type: String,
    required: true,
  },
  ExternalId: {
    type: String,
    required: true,
  },
  ChannelId: {
    type: String,
    required: true,
  },
  UpdateRequired: {
    type: String,
    required: true,
  },
  sync_error: {
    type: String,
    required: false,
  },
  magento_sync_status: {
    type: String,
    required: false,
  },
});

 categoriesSchema.plugin(mongoosePaginate);

const Categories = mongoose.model("Categories", categoriesSchema);

 Categories.paginate().then({}); // Usage

 // create the model for users and expose it to our app
module.exports = Categories;

