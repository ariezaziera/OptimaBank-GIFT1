// frontend/src/Page/Dashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  // Local promotion images & categories
  const promoBanners = [
    { img: "/1.png", category: "Clothing" },
    { img: "/2.png", category: "Food" },
    { img: "/3.png", category: "Handbag" },
    { img: "/4.png", category: "Shoes" },
  ];

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
        </div>

        {/* Points Island */}
        {user && (
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-3xl shadow-lg text-center transform hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/voucher")}
          >
            <h3 className="text-2xl font-bold">🏆 Your Reward Points</h3>
            <p className="text-4xl font-extrabold mt-3">{user.points}</p>
            <p className="opacity-90 mt-1">Click to redeem vouchers</p>
          </div>
        )}

        {/* Promotions Slider */}
        <div className="bg-white/70 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold mb-4">🔥 Ongoing Promotions</h3>
          <Slider {...sliderSettings}>
            {promoBanners.map((promo, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => navigate(`/voucher?category=${promo.category}`)}
                >
                  {/* Dark overlay for dim effect */}
                  <img
                    src={promo.img}
                    alt={promo.category}
                    className="w-full h-64 object-cover brightness-75"
                  />
                  
                  {/* Category text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/50 text-white px-6 py-2 rounded-lg text-xl font-bold shadow-md">
                      {promo.category}
                    </span>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
