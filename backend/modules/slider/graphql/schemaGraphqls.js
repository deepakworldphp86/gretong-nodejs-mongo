// schema.js
const { gql } = require('apollo-server-express');

// Define your schema
const typeDefs = gql`
  # Define the Slider type
  type Slider {
    id: ID!
    sliderId: String!
    name: String!
    code: String
    description: String
    sliderImage: String
    status: String!
    createdDate: String
    modifiedDate: String
    syncError: String
    magentoSyncStatus: String
    updateRequired: String
    storeId: String
  }

  # Define the SliderImage type
  type SliderImage {
    id: ID!
    sliderImageId: String!
    sliderId: String!
    sliderTitle: String!
    childSliderImage: String!
    sliderText: String!
    url: String!
    status: String!
    storeId: String
    createdDate: String
    updateRequired: String
    modifiedDate: String
  }

  # Define the query type
  type Query {
    getSlider(id: ID!): Slider
    listSliders(page: Int, limit: Int): [Slider]
    getSliderImage(id: ID!): SliderImage
    listSliderImages(page: Int, limit: Int, sliderId: String): [SliderImage]
  }

  # Define the mutation type
  type Mutation {
    createSlider(
      sliderId: String!
      name: String!
      code: String
      description: String
      sliderImage: String
      status: String!
      syncError: String
      magentoSyncStatus: String
      updateRequired: String
      storeId: String
    ): Slider

    updateSlider(
      id: ID!
      sliderId: String
      name: String
      code: String
      description: String
      sliderImage: String
      status: String
      syncError: String
      magentoSyncStatus: String
      updateRequired: String
      storeId: String
    ): Slider

    deleteSlider(id: ID!): Boolean

    createSliderImage(
      sliderImageId: String!
      sliderId: String!
      sliderTitle: String!
      childSliderImage: String!
      sliderText: String!
      url: String!
      status: String!
      storeId: String
      updateRequired: String
    ): SliderImage

    updateSliderImage(
      id: ID!
      sliderImageId: String
      sliderId: String
      sliderTitle: String
      childSliderImage: String
      sliderText: String
      url: String
      status: String
      storeId: String
      updateRequired: String
    ): SliderImage

    deleteSliderImage(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
