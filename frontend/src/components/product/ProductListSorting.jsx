import React from 'react';
import { Form } from 'react-bootstrap';

const Sorting = ({ sort, onSortChange }) => {
  return (
    <div className="sorting-container">
      <Form.Group controlId="sortSelect" className="sorting-group">
        <Form.Label>Sort By</Form.Label>
        <Form.Control as="select" onChange={onSortChange} value={sort} className="sorting-select">
          <option value="name">Name <i className="fas fa-sort fa-sm"></i></option>
          <option value="price">Price <i className="fas fa-sort fa-sm"></i></option>
          <option value="date">Date <i className="fas fa-sort fa-sm"></i></option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default Sorting;
