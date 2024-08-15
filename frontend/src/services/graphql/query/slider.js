// src/queries.js
import { gql } from '@apollo/client';

export const LIST_SLIDER_IMAGES = gql`
 query {
  listSliderImages(page: 1, limit: 10, sliderId: "1") {
    id
    sliderImageId
    sliderId
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