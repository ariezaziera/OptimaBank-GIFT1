import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-white text-white px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold mb-2 text-blue-950">
          👋 Hello{user ? `, ${user.firstName}` : ''}!
        </h1>
        <p className="text-lg mb-6 text-blue-950">Welcome to Optima Bank Dashboard</p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
