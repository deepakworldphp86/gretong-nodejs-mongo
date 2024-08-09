// src/components/Filter.js
import React from 'react';
import { Form } from 'react-bootstrap';

const ProductListFilter = ({ filter, onFilterChange }) => {
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange(prevFilter => ({
      ...prevFilter,
      [name]: checked
    }));
  };

  return (
    <div>
      <h4>Filters</h4>
      <Form>
        <Form.Check 
          type="checkbox"
          label="Best Seller"
          name="bestSeller"
          checked={filter.bestSeller || false}
          onChange={handleFilterChange}
        />
        <Form.Check 
          type="checkbox"
          label="Cross Sell"
          name="crossSell"
          checked={filter.crossSell || false}
          onChange={handleFilterChange}
        />
        <Form.Check 
          type="checkbox"
          label="New Product"
          name="newProduct"
          checked={filter.newProduct || false}
          onChange={handleFilterChange}
        />
        <Form.Group controlId="categoryFilter">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" onChange={(e) => onFilterChange(prevFilter => ({ ...prevFilter, category: e.target.value }))}>
            <option value="">Select Category</option>
            {/* Add options here */}
          </Form.Control>
        </Form.Group>
      </Form>
    </div>
  );
};

export default ProductListFilter;
