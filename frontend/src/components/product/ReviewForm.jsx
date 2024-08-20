import React, { useState } from 'react';
import { Button, Form, Collapse } from 'react-bootstrap';
import { useMutation, gql } from '@apollo/client';

// Check if the user is authenticated
const isAuthenticated = Boolean(localStorage.getItem('token'));
const userInfo = localStorage.getItem('userInfo');

console.log(userInfo)
const ADD_REVIEW = gql`
  mutation AddReview($productId: ObjectId!, $review: ReviewInput!) {
    addReview(productId: $productId, review: $review) {
      id
      reviews {
        name
        rating
        comment
        user
        createdAt
      }
    }
  }
`;

const ReviewForm = ({ productId, openReviewForm, setOpenReviewForm }) => {
  const [review, setReview] = useState({ name: '', rating: 5, comment: '', user: '' });
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setReview(prevReview => ({
      ...prevReview,
      rating
    }));
  };

  const handleSubmit = async () => {
    try {
      await addReview({ variables: { productId, review } });
      setOpenReviewForm(false); // Optionally close the form after submission
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Conditionally render the review form based on authentication status
  if (!isAuthenticated) {
    return <p>Please log in to write a review.</p>;
  }

  return (
    <>
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
            <Form.Group controlId="reviewUser">
              <Form.Label>User</Form.Label>
              <Form.Control type="text" name="user" value={review.user} onChange={handleReviewChange} />
            </Form.Group>
            <Form.Group controlId="reviewComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" rows={3} name="comment" value={review.comment} onChange={handleReviewChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
            {error && <p className="text-danger">Error: {error.message}</p>}
          </Form>
        </div>
      </Collapse>
    </>
  );
};

export default ReviewForm;
