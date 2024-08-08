// src/queries.js
import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories($limit: Int, $skip: Int) {
    categories(limit: $limit, skip: $skip) {
      id
      parentId
      name
    }
  }
`;
