// src/queries.js
import { gql } from '@apollo/client';

export const BEST_SELLER_PRODUCTS = gql`
  query {
    bestSellerProducts {
      id
      sku
      name
      price
      brand
      description
      rating
      numReviews
      countInStock
      status
      createdAt
      updatedAt
      storeId
      updateRequired
      productGalleryImage
      syncError
      magentoSyncStatus
      categories
      bestSeller
      newProduct
      crossSell
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($sortBy: String, $filterBy: ProductFiltersInput, $limit: Int, $offset: Int) {
    products(sortBy: $sortBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
      id
      name
      price
      rating
      productGalleryImage
    }
  }
`;



export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      price
      description
      rating
      numReviews
      productGalleryImage
    }
  }
`;
