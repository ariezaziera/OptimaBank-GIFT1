// src/Page/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);

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
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b border-blue-300">
        <h1 className="text-2xl font-bold">Optima Bank</h1>
        <nav className="flex gap-4">
          <Link to="/Dashboard" className="hover:underline">Home</Link>
          <Link to="/Profile" className="hover:underline">Profile</Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-md">
            Logout
          </button>
        </nav>
      </header>

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
