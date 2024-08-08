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


