// src/components/Search.js
import React from 'react';
import { Form } from 'react-bootstrap';

const ProductListSearch = ({ search, onSearchChange }) => {
  return (
    <Form.Group controlId="searchInput">
      <Form.Label>Search</Form.Label>
      <Form.Control
        type="text"
        placeholder="Search products"
        value={search}
        onChange={onSearchChange}
      />
    </Form.Group>
  );
};

export default ProductListSearch;
