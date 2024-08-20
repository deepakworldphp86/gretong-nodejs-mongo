// src/pages/ProductPage.js
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Button, Form, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProductGallery from '../product/ProductGallery';
import ReviewList from '../product/ReviewList';
import ReviewForm from '../product/ReviewForm';

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      _id
      id
      name
      price
      rating
      countInStock
      description
      productGalleryImage
      reviews {
        name
        rating
        comment
      }
    }
  }
`;

const ProductPage = () => {
  const { id } = useParams();
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const submitReview = (review) => {
    // Handle review submission
    console.log('Review submitted:', review);
  };

  const product = data.product;
  const starRating = Math.round(product.rating); // Assuming rating is an average value

  return (
    <Container>
      <Row>
        <Col md={6}>
          <ProductGallery images={[product.productGalleryImage]} altText={product.name} />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-between">
          <div className="product-info">
            <h1>{product.name}</h1>
            <h4>${product.price}</h4>
            <p>
              {product.countInStock > 1 ? 'Stock Available' : product.countInStock === 1 ? 'Only 1 left' : 'Not Available'}
            </p>
            <p>{product.description}</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= starRating ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <Stack direction="horizontal" gap={3} className="mt-3">
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                style={{ width: '100px' }}
              />
              <Button variant="primary" disabled={product.countInStock < 1}>
                Add to Cart
              </Button>
            </Stack>
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ReviewList reviews={product.reviews} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ReviewForm  productId={product._id}  submitReview={submitReview} openReviewForm={openReviewForm} setOpenReviewForm={setOpenReviewForm} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
