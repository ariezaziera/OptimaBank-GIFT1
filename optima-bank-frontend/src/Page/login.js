// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import Link juga!

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful!');
        navigate('/dashboard');
        console.log(data);
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('Background.jpeg')" }}>
      <div className="bg-white bg-opacity-20 p-10 rounded-2xl shadow-lg max-w-md w-full backdrop-blur-md">
        <h2 className="text-white text-3xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg outline-none"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg outline-none"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded-full">
            Login
          </button>
        </form>

        <a href="http://localhost:3000/auth/google">
          <button className="btn btn-google">Continue with Google</button>
        </a>

        <p className="text-center text-white mt-4">
          Don't have an account? <Link to="/signup" className="underline text-white">Signup</Link>
        </p>
      </div>
    </div>
  );
}
