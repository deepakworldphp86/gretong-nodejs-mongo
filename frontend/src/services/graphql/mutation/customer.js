// src/services/graphql/mutations.js
import { gql } from '@apollo/client';

// Define the LOGIN_USER mutation
export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      user {
        id
        firstname
        lastname
        email
        username
      }
    }
  }
`;

// Define the REGISTER_USER mutation
export const REGISTER_USER_RMUTATION = gql`
  mutation RegisterUser(
    $firstname: String!,
    $lastname: String!,
    $email: String!,
    $username: String!,
    $password: String!
  ) {
    registerUser(
      firstname: $firstname,
      lastname: $lastname,
      email: $email,
      username: $username,
      password: $password
    ) {
      id
      firstname
      lastname
      email
      username
    }
  }
`;
