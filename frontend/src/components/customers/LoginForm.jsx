import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { LOGIN_USER_MUTATION } from '../../services/graphql/mutation/customer';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const dispatch = useDispatch();

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER_MUTATION);

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
      const { data } = await loginUser({ variables: formData });
      dispatch(setCredentials({ ...data })); //Store data in redux
      const { token, user } = data.loginUser;
      localStorage.setItem('token', token); // Store token in local storage
      navigate('/customer/auth/profile');
      //alert('Login successful!');
      // Redirect or update UI as needed
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
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
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="text-danger">Error: {error.message}</p>}
      </Form>
    </Container>
  );
};

export default LoginForm;