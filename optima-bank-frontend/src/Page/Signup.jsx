// src/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Navbar from '../Navbar';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9]{6,}$/;

    if (!nameRegex.test(formData.firstName)) {
      alert('First name hanya boleh mengandungi huruf sahaja.');
      return false;
    }

    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      alert('Last name hanya boleh mengandungi huruf sahaja.');
      return false;
    }

    if (!usernameRegex.test(formData.username)) {
      alert('Username mesti sekurang-kurangnya 6 aksara dan hanya huruf/nombor.');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number mesti mengandungi nombor sahaja dan minimum 10 digit.');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      alert('Sila masukkan email yang sah (contoh: nama@email.com).');
      return false;
    }

    if (formData.password.length < 6) {
      alert('Password mesti sekurang-kurangnya 6 aksara.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Kata laluan dan pengesahan tidak sepadan.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
  
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://optimabank-gift1.onrender.com"; // 🟢 your deployed backend
  
    try {
      const res = await fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Signup berjaya!");
        navigate("/"); // balik ke halaman login
      } else {
        alert(data.message || "Signup gagal.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Ralat berlaku.");
    }
  };


  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
  
    // 🔹 Auto-detect environment
    const isLocalhost = window.location.hostname === "localhost";
  
    // 🔹 Backend + frontend URLs
    const backendURL = isLocalhost
      ? "http://localhost:5000" // local backend
      : "https://optimabank-gift1.onrender.com"; // production backend
  
    const frontendURL = isLocalhost
      ? "http://localhost:3000" // local frontend
      : "https://optimabank-gift.vercel.app"
      : "https://optima-bank-gift-1-fae227uux-arieza-azieras-projects.vercel.app"; // production frontend
  
    try {
      const res = await fetch(`${backendURL}/logout`, {
        method: "GET",
        credentials: "include", // keeps session cookies
      });
  
      if (res.ok) {
        localStorage.removeItem("user");
        window.location.href = frontendURL;
      } else {
        const errorData = await res.json();
        console.error("Logout failed:", errorData);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <>
      <Navbar handleLogout={handleLogout} />

      <div 
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
        style={{ backgroundImage: `url('/bg.png')` }} // <-- tukar ikut image path
      >

        <div className="bg-cyan-950/50 p-8 rounded-xl shadow-lg w-full max-w-2xl m-24">
          <h2 className="text-white text-3xl font-bold text-center mb-6">Signup</h2>
          
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="p-3 rounded-lg outline-none" required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="p-3 rounded-lg outline-none" />
            <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} className="p-3 rounded-lg outline-none col-span-2" required />
            <input type="date" name="dob" onChange={handleChange} value={formData.dob} className="p-3 rounded-lg outline-none col-span-2" required />
            <input type="text" name="phone" placeholder="Phone No." onChange={handleChange} value={formData.phone} className="p-3 rounded-lg outline-none" required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="p-3 rounded-lg outline-none" required />

            {/* Password with toggle */}
            <div className="relative col-span-2 sm:col-span-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 6 characters)"
                onChange={handleChange}
                value={formData.password}
                className="w-full p-3 pr-12 rounded-lg outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            {/* Confirm Password with toggle */}
            <div className="relative col-span-2 sm:col-span-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.confirmPassword}
                className="w-full p-3 pr-12 rounded-lg outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <button type="submit" className="col-span-2 bg-white text-black font-bold py-2 rounded-full">
              Signup
            </button>
          </form>
          
          <p className="text-center text-white mt-4">
            Already have an account? <Link to="/" className="underline text-white">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
