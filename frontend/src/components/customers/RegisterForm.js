import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Container } from 'react-bootstrap';
import { REGISTER_USER_RMUTATION } from '../../services/graphql/mutation/customer';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: ''
  });
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER_RMUTATION);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ variables: formData });
      //alert('Registration successful!');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: ''
      });
      navigate('/login');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formLastname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
        {error && <p className="text-danger">Error: {error.message}</p>}
      </Form>
    </Container>
  );
};

export default RegisterForm;