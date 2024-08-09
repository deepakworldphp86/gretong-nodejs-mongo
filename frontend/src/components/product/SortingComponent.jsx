import React from 'react';
import { Form } from 'react-bootstrap';

const SortingComponent = ({ onSortChange }) => {
  const handleChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <Form>
      <Form.Group controlId="sort">
        <Form.Label>Sort By</Form.Label>
        <Form.Control as="select" onChange={handleChange}>
          <option value="price">Price</option>
          <option value="createdDate">Creation Date</option>
          <option value="name">Name</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default SortingComponent;
