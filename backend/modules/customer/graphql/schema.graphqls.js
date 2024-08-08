const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Customer {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: Customer!
  }

  type Query {
    customerProfile: Customer
  }

  type Mutation {
    registerUser(
      firstname: String!
      lastname: String!
      email: String!
      username: String!
      password: String!
    ): Customer
    loginUser(
      username: String!
      password: String!
    ): AuthPayload
  }
`;

module.exports = typeDefs;
