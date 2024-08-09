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
      </Form>
    </div>
  );
};

export default ProductListFilter;