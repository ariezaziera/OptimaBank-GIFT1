import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        navigate('/'); // go to login
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <AuthLayout bgImage="">
      <h2 className="text-white text-3xl font-bold text-center mb-6">Signup</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <input type="date" name="dob" onChange={handleChange} value={formData.dob} className="p-3 rounded-lg outline-none col-span-2" required />
          <input type="text" name="phone" placeholder="Phone No." onChange={handleChange} value={formData.phone} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <input type="password" name="password" placeholder="Password (min 6 characters)" onChange={handleChange} value={formData.password} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} value={formData.confirmPassword} className="p-3 rounded-lg outline-none" autoComplete="off" required />
          <button type="submit" className="col-span-2 bg-white text-black font-bold py-2 rounded-full">Signup</button>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account? <Link to="/" className="underline text-white">Login</Link>
        </p>  
    </AuthLayout>
    
  );
}
