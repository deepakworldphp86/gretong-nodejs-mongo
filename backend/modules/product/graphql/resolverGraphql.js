const { productModel } = require("../models/product.model.js");
const express = require("express");

const app = express();

// Define your base URL for images
const IMAGE_BASE_URL = 'http://localhost:3000/admin/uploads/product_images/';

const resolvers = {
  Query: {
    // Fetch all products with sorting, filtering, searching, and pagination
    products: async (_, { sort, filter, page = 1, limit = 10, search }) => {
      try {
        let query = {};

        // Search filter
        if (search) {
          query.name = new RegExp(search, 'i'); // Case-insensitive search by product name
        }

        // Additional filters
        if (filter) {
          if (filter.bestSeller) query.bestSeller = '1';
          if (filter.crossSell) query.crossSell = '1';
          if (filter.newProduct) query.newProduct = '1';
          if (filter.categoryIds && filter.categoryIds.length > 0) {
            query.categories = { $in: filter.categoryIds };
          }
        }

        const options = {
          sort: sort ? { [sort]: 1 } : {}, // Default sort by ascending
          page,
          limit
        };

        // Fetch paginated products
        const result = await productModel.paginate(query, options);

        // Debugging: Check the result
        console.log('Paginated Result:', result);

        if (!result || !result.docs) {
          throw new Error('No products found');
        }

        // Map over products to prepend base URL to image
        const products = result.docs.map(product => ({
          ...product._doc,
          productGalleryImage: product.productGalleryImage
            ? `${IMAGE_BASE_URL}${product.productGalleryImage}`
            : null
        }));

        return {
          products,
          totalCount: result.totalDocs,
          totalPages: result.totalPages,
          currentPage: result.page
        };
      } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Error fetching products');
      }
    },
    // Fetch a single product by id
    product: async (_, { id }) => {
      try {
        const product = await productModel.findOne({ id });
        if (product) {
          return {
            ...product._doc,
            productGalleryImage: product.productGalleryImage
              ? `${IMAGE_BASE_URL}${product.productGalleryImage}`
              : null
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Error fetching product');
      }
    },
    // Fetch products marked as bestsellers with image base URL
    bestSellerProducts: async () => {
      try {
        const products = await productModel.find({ bestSeller: '1' });
        return products.map(product => ({
          ...product._doc,
          productGalleryImage: product.productGalleryImage
            ? `${IMAGE_BASE_URL}${product.productGalleryImage}`
            : null
        }));
      } catch (error) {
        console.error('Error fetching best seller products:', error);
        throw new Error('Error fetching best seller products');
      }
    }
  },
  Mutation: {
    // Create a new product
    createProduct: async (_, args) => {
      try {
        const product = new productModel(args);
        return await product.save();
      } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Error creating product');
      }
    },
    // Update an existing product by id
    updateProduct: async (_, args) => {
      try {
        const { id, ...updateFields } = args;
        return await productModel.findOneAndUpdate({ id }, updateFields, { new: true });
      } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Error updating product');
      }
    },
    // Delete a product by id
    deleteProduct: async (_, { id }) => {
      try {
        return await productModel.findOneAndDelete({ id });
      } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Error deleting product');
      }
    }
  }
};

module.exports = resolvers;
