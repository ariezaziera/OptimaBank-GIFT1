import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './Page/Signup';
import LoginPage from './Page/login';
import Dashboard from './Page/Dashboard';
import ForgotPassword from './Page/ForgotPassword';
import ResetPassword from './Page/ResetPassword';
import Profile from './Page/Profile';
import Voucher from './Page/Voucher';
import Cart from './Page/Cart';
import History from './Page/History';
import AboutUs from './Page/AboutUs';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './App.css'; // optional: global styling

function App() {
  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  // Remove item from cart by ID
  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/voucher" element={<Voucher handleAddToCart={handleAddToCart} />} />
        <Route path="/cart" element={ <Cart cartItems={cartItems} handleRemoveFromCart={handleRemoveFromCart} />}/>
        <Route path="/history" element={<History />} /> 
        <Route path="/about-us" element={<AboutUs />} />
      </Routes> {/* ✅ Close this tag */}
    </Router>
  );
}

export default App;
