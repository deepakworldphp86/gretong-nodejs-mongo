import React from 'react';
import { Carousel } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { BEST_SELLER_PRODUCTS } from '../../services/graphql/query/product';

// Function to chunk the array into smaller arrays
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

// Function to render stars based on the number of reviews
const renderStars = (num) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`star ${index < num ? 'filled' : ''}`}>★</span>
  ));
  return <div className="stars">{stars}</div>;
};

const ProductSlider = () => {
  // Fetch bestseller products using the GraphQL query
  const { loading, error, data } = useQuery(BEST_SELLER_PRODUCTS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ensure data and data.bestSellerProducts exist
  const products = data?.bestSellerProducts || [];
  const slides = chunkArray(products, 4); // Create slides with 4 products each

  return (
    <div className="product-slider-container">
      <h2>Best Sellers</h2>
      <p>Hot Best Sellers Product</p>
      <Carousel className="product-slider">
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-between">
              {slide.map(product => (
                <div className="product-item" key={product.id}>
                  <Link to={`/products/${product.id}`}>
                    <img
                      className="d-block w-100"
                      src={product.productGalleryImage || 'https://via.placeholder.com/200x200?text=No+Image'} // Fallback image
                      alt={product.name}
                    />
                  </Link>
                  <div className="product-info">
                    <h5>{product.name}</h5>
                    <p className="price">${product.price.toFixed(2)}</p>
                    {renderStars(product.rating)}
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductSlider;
