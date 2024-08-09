// src/pages/ProductPage.js
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Button, Form, Carousel, Collapse, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
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
  const [review, setReview] = useState({ name: '', rating: 5, comment: '' });
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleStarClick = (rating) => {
    setReview(prevReview => ({
      ...prevReview,
      rating
    }));
  };

  const submitReview = () => {
    // Handle review submission
    console.log('Review submitted:', review);
  };

  const product = data.product;
  const starRating = Math.round(product.rating); // Assuming rating is an average value

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Carousel>
            {/* Display images in the carousel */}
            {product.productGalleryImage && (
              <Carousel.Item>
                <img className="d-block w-100" src={product.productGalleryImage} alt={product.name} />
              </Carousel.Item>
            )}
            {/* You can add more Carousel.Item for additional images if available */}
          </Carousel>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-between">
          <div className="product-info">
            <h1>{product.name}</h1>
            <h4>${product.price}</h4>
            <p>
              {product.stock > 1 ? 'Stock Available' : product.countInStock === 1 ? 'Only 1 left' : 'Not Available'}
            </p>
            <p>{product.description}</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= starRating ? 'filled' : ''}`}
                  onClick={() => handleStarClick(star)}
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
          <h3>Reviews</h3>
          {product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="mb-3">
                <h4>{review.name}</h4>
                <p>{review.comment}</p>
                <p>Rating: {review.rating} ★</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Button
            variant="info"
            onClick={() => setOpenReviewForm(!openReviewForm)}
            aria-controls="reviewForm"
            aria-expanded={openReviewForm}
          >
            {openReviewForm ? 'Close Review Form' : 'Write a Review'}
          </Button>
          <Collapse in={openReviewForm}>
            <div id="reviewForm" className="mt-3">
              <Form>
                <h3>Write a Review</h3>
                <Form.Group controlId="reviewRating">
                  <Form.Label>Rating</Form.Label>
                  <div className="star-rating mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= review.rating ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group controlId="reviewName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={review.name} onChange={handleReviewChange} />
                </Form.Group>
                <Form.Group controlId="reviewComment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control as="textarea" rows={3} name="comment" value={review.comment} onChange={handleReviewChange} />
                </Form.Group>
                <Button variant="primary" onClick={submitReview}>Submit Review</Button>
              </Form>
            </div>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
