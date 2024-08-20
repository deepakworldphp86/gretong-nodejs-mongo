// resolvers.js
const { sliderModel, sliderImageModel } = require('../models/sliderModel'); // Adjust path as necessary
const IMAGE_BASE_URL = 'http://localhost:3000/admin/uploads/slider_image/';

const resolvers = {
  Query: {
    async getSlider(_, { id }) {
      return await sliderModel.findById(id);
    },
    async listSliders(_, { page = 1, limit = 10 }) {
      const result = await sliderModel.paginate({}, { page, limit });
      return result.docs; // Assuming `paginate` returns an object with `docs` array
    },
    async getSliderImage(_, { id }) {
      return await sliderImageModel.findById(id);
    },
    async getSliderImageBySliderId(_, { sliderId }) {
      return await sliderImageModel.find({ sliderId: sliderId });
    },
    async listSliderImages(_, { page = 1, limit = 10, sliderId }) {
      const query = sliderId ? { sliderId } : {};
      const result = await sliderImageModel.paginate(query, { page, limit });

      // Map over documents to prepend base URL to image
      const slider = result.docs.map(doc => ({
        ...doc._doc, // Assuming _doc is used to access the document's properties
        childSliderImage: doc.childSliderImage
          ? `${IMAGE_BASE_URL}${doc.childSliderImage}`
          : null
      }));

      return slider; // Assuming `paginate` returns an object with `docs` array
    },
  },
  Mutation: {
    async createSlider(_, args) {
      const slider = new sliderModel(args);
      return await slider.save();
    },
    async updateSlider(_, { id, ...updates }) {
      return await sliderModel.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteSlider(_, { id }) {
      const result = await sliderModel.findByIdAndDelete(id);
      return !!result;
    },
    async createSliderImage(_, args) {
      const sliderImage = new sliderImageModel(args);
      return await sliderImage.save();
    },
    async updateSliderImage(_, { id, ...updates }) {
      return await sliderImageModel.findByIdAndUpdate(id, updates, { new: true });
    },
    async deleteSliderImage(_, { id }) {
      const result = await sliderImageModel.findByIdAndDelete(id);
      return !!result;
    },
  },
};

module.exports = resolvers;
