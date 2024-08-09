// src/components/Pagination.js
import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-wrapper">
      <BootstrapPagination className="pagination-custom">
        <BootstrapPagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </BootstrapPagination.Prev>
        {Array.from({ length: totalPages }, (_, index) => (
          <BootstrapPagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </BootstrapPagination.Item>
        ))}
        <BootstrapPagination.Next
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </BootstrapPagination.Next>
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
