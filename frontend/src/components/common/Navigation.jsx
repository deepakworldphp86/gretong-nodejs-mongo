import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../services/graphql/query/categories';
import { Link, useNavigate } from 'react-router-dom';

// Function to build menu items from category data
const buildMenu = (categories) => {
  const map = new Map();
  const roots = [];

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach(cat => {
    if (cat.parentId === '0') {
      roots.push(map.get(cat.id));
    } else {
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children.push(map.get(cat.id));
      }
    }
  });

  return roots;
};

const Navigation = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES, {
    variables: { limit: 100, skip: 0 }, // Adjust limit and skip as needed
  });
  
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const menuItems = buildMenu(data.categories);

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Brand</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuItems.map((item) => (
              <NavDropdown
                title={item.name}
                id={`dropdown-${item.id}`}
                key={item.id}
              >
                {item.children.length > 0 && item.children.map((subItem) => (
                  <NavDropdown.Item as={Link} to={`/${subItem.id}`} key={subItem.id}>
                    {subItem.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ))}
          </Nav>
          <Nav className="ms-auto"> {/* Align to the right */}
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-user"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="fas fa-user-plus"></i> Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/customer/auth/profile">
                  <i className="fas fa-user"></i> Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/cart">
              <i className="fas fa-shopping-cart"></i> Cart
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
