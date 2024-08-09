// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen'; // Adjust import path as needed
import RegisterScreen from './screens/RegisterScreen'; // Adjust import path as needed
import LoginScreen from './screens/LoginScreen'; // Adjust import path as needed
import CustomerProfileScreen from './screens/CustomerProfileScreen';
import ProductListScreen from './screens/ProductListScreen';

//import CartScreen from './screens/CartScreen'; // Adjust import path as needed
//import NotFoundScreen from './screens/NotFoundScreen'; // Adjust import path as needed

const App = () => {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/customer/auth/profile" element={<CustomerProfileScreen />} />
          <Route path="/products/:categoryId"  element={<ProductListScreen />} />

          ProductListScreen

          {/* <Route path="/cart" element={<CartScreen />} /> */}
          {/* <Route path="*" element={<NotFoundScreen />} /> */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;
