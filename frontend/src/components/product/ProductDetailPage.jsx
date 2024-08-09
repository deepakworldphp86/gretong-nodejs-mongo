import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Button, Form, Carousel } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      price
      rating
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

  const submitReview = () => {
    // Handle review submission
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Carousel>
            {/* Add images to the carousel */}
            <Carousel.Item>
              <img className="d-block w-100" src={data.product.productGalleryImage} alt={data.product.name} />
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6}>
          <h1>{data.product.name}</h1>
          <p>${data.product.price}</p>
          <p>Rating: {data.product.rating}</p>
          <Button variant="primary">Add to Cart</Button>
          <h3>Reviews</h3>
          {data.product.reviews.map((review, index) => (
            <div key={index}>
              <h4>{review.name}</h4>
              <p>{review.comment}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))}
          <Form>
            <h3>Write a Review</h3>
            <Form.Group controlId="reviewName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={review.name} onChange={handleReviewChange} />
            </Form.Group>
            <Form.Group controlId="reviewRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control as="select" name="rating" value={review.rating} onChange={handleReviewChange}>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="reviewComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" rows={3} name="comment" value={review.comment} onChange={handleReviewChange} />
            </Form.Group>
            <Button variant="primary" onClick={submitReview}>Submit Review</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
