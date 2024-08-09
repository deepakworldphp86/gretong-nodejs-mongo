const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Review {
    name: String!
    rating: Int!
    comment: String!
    user: String! 
    createdAt: String
    updatedAt: String
  }

  type Product {
    id: String!
    sku: String!
    name: String!
    price: Float!
    brand: String
    description: String
    reviews: [Review]
    rating: Int!
    numReviews: Int!
    countInStock: Int!
    status: String!
    createdAt: String
    updatedAt: String
    storeId: String!
    updateRequired: String!
    productGalleryImage: String
    syncError: String
    magentoSyncStatus: String
    categories: [String]
    bestSeller: String
    newProduct: String
    crossSell: String
  }

  type ProductPage {
    products: [Product]
    totalCount: Int
    totalPages: Int
    currentPage: Int
  }

  input FilterInput {
    bestSeller: Boolean
    crossSell: Boolean
    newProduct: Boolean
    category: String
  }

  type Query {
    products(sort: String, filter: FilterInput, page: Int, limit: Int, search: String): ProductPage
    product(id: String!): Product
    bestSellerProducts: [Product]
  }

  type Mutation {
    createProduct(
      id: String!
      sku: String!
      name: String!
      price: Float!
      brand: String
      description: String
      reviews: [ReviewInput]
      rating: Int
      numReviews: Int
      countInStock: Int
      status: String!
      storeId: String!
      updateRequired: String!
      productGalleryImage: String
      syncError: String
      magentoSyncStatus: String
      categories: [String]
      bestSeller: String
      newProduct: String
      crossSell: String
    ): Product
    updateProduct(
      id: String!
      sku: String
      name: String
      price: Float
      brand: String
      description: String
      reviews: [ReviewInput]
      rating: Int
      numReviews: Int
      countInStock: Int
      status: String
      storeId: String
      updateRequired: String
      productGalleryImage: String
      syncError: String
      magentoSyncStatus: String
      categories: [String]
      bestSeller: String
      newProduct: String
      crossSell: String
    ): Product
    deleteProduct(id: String!): Product
  }

  input ReviewInput {
    name: String!
    rating: Int!
    comment: String!
    user: String!
  }
`;

module.exports = typeDefs;
