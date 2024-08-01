let { categoriesModel, schema } = require("../models/category.model.js");

// Define the resolvers
const resolvers = {
  Query: {
    categories: async (_, { limit, skip }) => {
      return await categoriesModel.find().skip(skip || 0).limit(limit || 0);
    },
    category: async (_, { id }) => {
      return await categoriesModel.findById(id);
    },
    categoriesByStore: async (_, { storeId, limit, skip }) => {
      return await categoriesModel.find({ storeId }).skip(skip || 0).limit(limit || 0);
    },
  },
  Mutation: {
    createCategory: async (_, args) => {
      const category = new categoriesModel(args);
      return await category.save();
    },
    updateCategory: async (_, args) => {
      const { id, ...updateFields } = args;
      return await categoriesModel.findByIdAndUpdate(id, updateFields, { new: true });
    },
    deleteCategory: async (_, { id }) => {
      return await categoriesModel.findByIdAndDelete(id);
    },
  },
};

module.exports = resolvers;
