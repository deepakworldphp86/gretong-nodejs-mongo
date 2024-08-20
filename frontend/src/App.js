// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen'; // Adjust import path as needed
import RegisterScreen from './screens/RegisterScreen'; // Adjust import path as needed
import LoginScreen from './screens/LoginScreen'; // Adjust import path as needed
import CustomerProfileScreen from './screens/CustomerProfileScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import { logout } from './redux/authSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

//import CartScreen from './screens/CartScreen'; // Adjust import path as needed
//import NotFoundScreen from './screens/NotFoundScreen'; // Adjust import path as needed

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/customer/auth/profile" element={<CustomerProfileScreen />} />
          <Route path="/category/:categoryId"  element={<ProductListScreen />} />
          <Route path="/products/:id" element={<ProductScreen />} />

          

          {/* <Route path="/cart" element={<CartScreen />} /> */}
          {/* <Route path="*" element={<NotFoundScreen />} /> */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
