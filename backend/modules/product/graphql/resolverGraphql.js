const { GraphQLScalarType, Kind } = require('graphql');
const mongoose = require("mongoose");
const { productModel } = require("../models/productModel.js");

// Custom scalar for MongoDB ObjectId
const ObjectId = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Custom scalar type for MongoDB ObjectId',
  parseValue(value) {
    return mongoose.Types.ObjectId(value); // Convert client value to ObjectId
  },
  serialize(value) {
    return value.toString(); // Convert MongoDB ObjectId to string for the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return mongoose.Types.ObjectId(ast.value); // Convert AST value to ObjectId
    }
    return null;
  },
});

// Define your base URL for images
const IMAGE_BASE_URL = 'http://localhost:3000/admin/uploads/product_images/';

const resolvers = {
  ObjectId, // Include the ObjectId scalar here
  Query: {
    products: async (_, { sort, filter, page = 1, limit = 10, search }) => {
      try {
        let query = {};

        // Search filter
        if (search) {
          query.name = new RegExp(search, 'i'); // Case-insensitive search by product name
        }

        // Additional filters
        if (filter) {
          if (filter.bestSeller === 0 || filter.bestSeller === 1) query.bestSeller = filter.bestSeller;
          if (filter.crossSell === 0 || filter.crossSell === 1) query.crossSell = filter.crossSell;
          if (filter.newProduct === 0 || filter.newProduct === 1) query.newProduct = filter.newProduct;
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
    product: async (_, { id }) => {
      try {
        const product = await productModel.findOne({ id });
        if (product) {
          return {
            ...product._doc,
            _id: product._id.toString(), // Convert _id to string
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
    productReviews: async (_, { productId }) => {
      const product = await productModel.findById(productId); // ObjectId
      return product.reviews || []; // Return reviews for the specified product
    },
  },
  Mutation: {
    addReview: async (_, { productId, review }) => {
      const product = await productModel.findById(productId);
      product.reviews.push(review);
      await product.save();
      return product; // Return the updated product
    },
  }
};

module.exports = resolvers;
