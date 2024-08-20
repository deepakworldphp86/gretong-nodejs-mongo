// src/queries.js
import { gql } from '@apollo/client';

// Define your GraphQL query
export const GET_SLIDER_IMAGES = gql`
  query {
    listSliderImages(page: 1, limit: 10, sliderId: "1") {
      sliderImageId
      sliderTitle
      childSliderImage
      sliderText
      url
      status
      storeId
      createdDate
      updateRequired
      modifiedDate
    }
  }
`;