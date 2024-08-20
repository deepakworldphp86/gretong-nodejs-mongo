// src/components/ProductCarousel.js
import React from 'react';
import { Carousel } from 'react-bootstrap';

const ProductCarousel = ({ images, altText }) => {
  return (
    <Carousel>
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={image} alt={altText || 'Product image'} />
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <img className="d-block w-100" src="/path/to/placeholder/image.jpg" alt="Placeholder image" />
        </Carousel.Item>
      )}
    </Carousel>
  );
};

export default ProductCarousel;
