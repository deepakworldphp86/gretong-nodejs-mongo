let { productModel, schema } = require("../models/product.model.js");
// Define the resolvers
const resolvers = {
  Query: {
    products: async () => await productModel.find(),
    product: async (_, { id }) => await productModel.findOne({ id }),
  },
  Mutation: {
    createProduct: async (_, args) => {
      const product = new productModel(args);
      return await product.save();
    },
    updateProduct: async (_, args) => {
      const { id, ...updateFields } = args;
      return await productModel.findOneAndUpdate({ id }, updateFields, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      return await productModel.findOneAndDelete({ id });
    },
  },
};


module.exports = resolvers;
