// src/AuthLayout.js
import React from 'react';
import './AuthLayout.css'; // optional

const AuthLayout = ({ children, bgImage }) => {
  const defaultBg = "url('/Background.jpeg')"; // Put your default image path here

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : defaultBg }}
    >
      <div className="bg-white bg-opacity-20 p-10 rounded-2xl shadow-lg max-w-md w-full backdrop-blur-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
