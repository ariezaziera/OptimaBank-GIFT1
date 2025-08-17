// frontend/src/Page/Dashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [promotions, setPromotions] = useState([]);

  // Load user from params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    if (email) {
      const user = {
        _id: params.get('_id'),
        firstName: params.get('firstName'),
        lastName: params.get('lastName'),
        username: params.get('username'),
        email,
        profileImage: params.get('profileImage'),
        points: parseInt(params.get('points')) || 0
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      alert("Login successful!");
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  // Fetch promotions
  useEffect(() => {
    fetch("http://localhost:5000/api/promotions")
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(err => console.error("Error fetching promotions:", err));
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

      <main className="max-w-5xl mx-auto mt-10 space-y-8">
        {/* Greeting */}
        <div className="bg-white/70 p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-2">
            👋 Hello{user ? `, ${user.username}` : ''}!
          </h2>
          <p className="text-lg mb-2">Welcome to Optima Bank Dashboard</p>

          {user && (
            <p className="text-lg font-semibold mt-4">
              Your Points: <span className="text-green-700">{user.points}</span>
            </p>
          )}
        </div>

        {/* Account Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold">💰 Main Account</h3>
            <p className="text-2xl mt-2">RM 12,350.50</p>
            <p className="mt-1 opacity-80">Available Balance</p>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold">🏦 Savings</h3>
            <p className="text-2xl mt-2">RM 4,500.00</p>
            <p className="mt-1 opacity-80">Emergency Fund</p>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold">📊 Transactions</h3>
            <p className="text-2xl mt-2">+ RM 2,100</p>
            <p className="mt-1 opacity-80">This Month</p>
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-white/70 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold mb-4">🔥 Ongoing Promotions</h3>
          {promotions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <div key={promo._id} className="bg-gradient-to-r from-yellow-200 to-orange-300 p-4 rounded-xl shadow hover:shadow-lg transition">
                  <h4 className="text-lg font-bold">{promo.title}</h4>
                  <p className="mt-2">{promo.description}</p>
                  <p className="text-sm text-gray-700 mt-1">Valid until: {new Date(promo.expiryDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No promotions available right now.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
