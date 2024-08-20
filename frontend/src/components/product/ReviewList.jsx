// src/components/ReviewList.js
import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="mb-3">
            <h4>{review.name}</h4>
            <p>{review.comment}</p>
            <p>Rating: {review.rating} ★</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;
