// src/AuthLayout.js
import React from 'react';
import './AuthLayout.css'; // optional

const AuthLayout = ({ children, bgImage }) => {
  const defaultBg = "url('/bg.png')"; // Put your default image path here

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : defaultBg }}
    >
      <div
        className="p-8 rounded-3xl shadow-lg w-full mx-20 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(3, 49, 66, 0.4)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
