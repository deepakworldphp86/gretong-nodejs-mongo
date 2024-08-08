// src/components/ProfilePage.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
const GET_CUSTOMER_PROFILE = gql`
  query GetCustomerProfile {
    customerProfile {
      id
      firstname
      lastname
      email
      username
    }
  }
`;

const ProfilePage = () => {
  const { loading, error, data } = useQuery(GET_CUSTOMER_PROFILE);
  const navigate = useNavigate();
  if (loading) return <p>Loading...</p>;
  if (error) {
    // If there's an error fetching user data (e.g., not authenticated), redirect to login
    navigate('/login');
    return null;
  }

  const customer = data.customerProfile;
  console.log(customer);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2>Profile</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>First Name:</strong> {customer.firstname}
          </Card.Text>
          <Card.Text>
            <strong>Last Name:</strong> {customer.lastname}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {customer.email}
          </Card.Text>
          <Card.Text>
            <strong>Username:</strong> {customer.username}
          </Card.Text>
          <Button variant="primary" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
