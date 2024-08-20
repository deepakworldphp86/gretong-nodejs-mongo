const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar ObjectId

  type Product {
    _id: ObjectId
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
    categories: [String]  # Array of category IDs
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
    bestSeller: Int
    crossSell: Int
    newProduct: Int
    categoryIds: [String]  # Array of category IDs
  }

  type Query {
    products(sort: String, filter: FilterInput, page: Int, limit: Int, search: String): ProductPage
    product(id: String!): Product
    bestSellerProducts: [Product]
    productReviews(productId: ObjectId!): [Review]  # Use ObjectId scalar for product reviews
  }

  type Review {
    name: String!
    rating: Int!
    comment: String!
    user: ObjectId!  # Use ObjectId scalar for user reference
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    name: String!
    rating: Int!
    comment: String!
    user: ObjectId!  # Use ObjectId scalar for user reference
  }

  type Mutation {
    addReview(productId: ObjectId!, review: ReviewInput!): Product  # Use ObjectId scalar for productId
  }
`;

module.exports = typeDefs;
