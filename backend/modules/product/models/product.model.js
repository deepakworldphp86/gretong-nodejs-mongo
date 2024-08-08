const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

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
  brand: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    trim: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
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
    type: String,
    trim: true,
  }],
  bestSeller: { // New field for bestseller status
    type: String,
    trim: true,
    default: 0,
  },
  newProduct: { // New field for new product status
    type: String,
    trim: true,
    default: 0,
  },
  crossSell: { // New field for cross-sell status
    type: String,
    trim: true,
    default: 0,
  }
}, {
  timestamps: true,
});

// Apply pagination plugin
prodSchema.plugin(mongoosePaginate);

// Create the Product model
const products = mongoose.model("products", prodSchema);

// Export the model and schema
module.exports = {
  productModel: products,
  schema: prodSchema
};
