// src/Page/Dashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isGoogleLogin = params.get('login');

    if (isGoogleLogin === 'google') {
      alert('Google login successful!');
      params.delete('login');
      window.history.replaceState({}, '', window.location.pathname); // clean URL
    }
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      const res = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('user');
        window.location.href = 'http://localhost:3000/';
      } else {
        console.error('Logout failed:', await res.json());
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-white text-blue-950 px-6 py-6">
        <Navbar user={user} handleLogout={handleLogout} />

      {/* Welcome Section */}
      <main className="max-w-4xl mx-auto mt-12 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-2">
          👋 Hello{user ? `, ${user.firstName}` : ''}!
        </h2>
        <p className="text-lg mb-6">Welcome to Optima Bank Dashboard</p>
      </main>
    </div>
  );
};

export default Dashboard;
