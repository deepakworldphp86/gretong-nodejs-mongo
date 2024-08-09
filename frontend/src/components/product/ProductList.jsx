// src/pages/ProductListPage.js
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Filter from '../product/ProductListFilter';
import Search from '../product/ProductListSearch';
import Sorting from '../product/SortingComponent';
import Pagination from '../product/PaginationComponent';

const GET_PRODUCTS = gql`
  query GetProducts($sort: String, $filter: FilterInput, $page: Int, $limit: Int, $search: String) {
    products(sort: $sort, filter: $filter, page: $page, limit: $limit, search: $search) {
      products {
        id
        name
        price
        rating
        productGalleryImage
        numReviews
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

const ProductListPage = () => {
  const [sort, setSort] = useState('name');
  const [filter, setFilter] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { sort, filter, page, limit, search }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to the first page when filters change
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when search term changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const { products: productList, totalCount, totalPages, currentPage } = data.products || {};

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Filter filter={filter} onFilterChange={handleFilterChange} />
        </Col>
        <Col md={9}>
          <Search search={search} onSearchChange={handleSearchChange} />
          <Sorting sort={sort} onSortChange={handleSortChange} />
          <Row>
            {productList && productList.map(product => (
              <Col md={4} key={product.id} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={product.productGalleryImage} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      <strong>${product.price}</strong> <br />
                      Rating: {product.rating} ({product.numReviews} reviews)
                    </Card.Text>
                    <Link to={`/products/${product.id}`}>
                      <Button variant="primary">View Product</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;
