// graphql/schema.js
const { gql } = require('apollo-server-express');

// Define the GraphQL schema
const typeDefs = gql`
  type Category {
    id: ID!
    parentId: String!
    code: String!
    name: String!
    description: String!
    status: String!
    createdDate: String
    modifiedDate: String
    externalId: String
    storeId: String!
    updateRequired: String
    categoryImage: String
    syncError: String
    magentoSyncStatus: String
  }

  type Query {
    categories(limit: Int, skip: Int): [Category]
    category(id: ID!): Category
    categoriesByStore(storeId: String!, limit: Int, skip: Int): [Category]
  }

  type Mutation {
    createCategory(
      parentId: String!
      code: String!
      name: String!
      description: String!
      status: String!
      externalId: String
      storeId: String!
      updateRequired: String
      categoryImage: String
      syncError: String
      magentoSyncStatus: String
    ): Category
    updateCategory(
      id: ID!
      parentId: String
      code: String
      name: String
      description: String
      status: String
      externalId: String
      storeId: String
      updateRequired: String
      categoryImage: String
      syncError: String
      magentoSyncStatus: String
    ): Category
    deleteCategory(id: ID!): Category
  }
`;


module.exports = typeDefs;
