// graphql/schema.js
const { gql } = require('apollo-server-express');

// Define the GraphQL schema
const typeDefs = gql`
  type Product {
    id: String!
    sku: String!
    name: String!
    price: Float!
    description: String
    status: String!
    createdAt: String
    updatedAt: String
    storeId: String!
    updateRequired: String!
    productGalleryImage: String
    syncError: String
    magentoSyncStatus: String
    categories: [String]
  }

  type Query {
    products: [Product]
    product(id: String!): Product
  }

  type Mutation {
    createProduct(
      id: String!
      sku: String!
      name: String!
      price: Float!
      description: String
      status: String!
      storeId: String!
      updateRequired: String!
      productGalleryImage: String
      syncError: String
      magentoSyncStatus: String
      categories: [String]
    ): Product
    updateProduct(
      id: String!
      sku: String
      name: String
      price: Float
      description: String
      status: String
      storeId: String
      updateRequired: String
      productGalleryImage: String
      syncError: String
      magentoSyncStatus: String
      categories: [String]
    ): Product
    deleteProduct(id: String!): Product
  }
`;


module.exports = typeDefs;
