const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Define the product schema
const prodSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  storeId: {
    type: String,
    required: true,
    trim: true,
  },
  updateRequired: {
    type: String,
    required: true,
    default: false,
  },
  productGalleryImage: {
    type: String,
    trim: true,
  },
  syncError: {
    type: String,
    trim: true,
  },
  magentoSyncStatus: {
    type: String,
    trim: true,
  },
  categories: [{
    type:String,
    trim: true,
  }]
});



var productSchema = mongoose.Schema(prodSchema);
// Apply pagination plugin
productSchema.plugin(mongoosePaginate);

// Create the Product model
const products = mongoose.model("products", productSchema);

products.paginate().then({}); // Usage

// create the model for users and expose it to our app
module.exports = {
  productModel: products,
  schema: prodSchema
};
