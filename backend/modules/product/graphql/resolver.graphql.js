// src/graphql/resolvers.js
const { productModel } = require("../models/product.model.js");
const express = require("express");

const app = express();

// Define your base URL for images
const IMAGE_BASE_URL = 'http://localhost:3000/admin/uploads/product_images/';

const resolvers = {
  Query: {
    // Fetch all products
    products: async () => {
      return await productModel.find();
    },
    // Fetch a single product by id
    product: async (_, { id }) => {
      return await productModel.findOne({ id });
    },
    // Fetch products marked as bestsellers with image base URL
    bestSellerProducts: async () => {
      const products = await productModel.find({ bestSeller: '1' }); // Assuming '1' indicates bestseller
      
      // Prepend the image base URL to each product's image URL
      return products.map(product => ({
        ...product._doc, // Spread the product document fields
        productGalleryImage: product.productGalleryImage
          ? `${IMAGE_BASE_URL}${product.productGalleryImage}`
          : null // Use a fallback if image URL is not present
      }));
    }
  },
  Mutation: {
    // Create a new product
    createProduct: async (_, args) => {
      const product = new productModel(args);
      return await product.save();
    },
    // Update an existing product by id
    updateProduct: async (_, args) => {
      const { id, ...updateFields } = args;
      return await productModel.findOneAndUpdate({ id }, updateFields, { new: true });
    },
    // Delete a product by id
    deleteProduct: async (_, { id }) => {
      return await productModel.findOneAndDelete({ id });
    }
  }
};

module.exports = resolvers;
