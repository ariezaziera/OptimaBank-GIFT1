// frontend/src/Page/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../Navbar';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const closeWelcome = () => {
    if (user) {
      const flagKey = `welcomeShown_${user._id || user.email}`;
      localStorage.setItem(flagKey, 'true');
    }
    setShowPointsPopup(false);
  };

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
        points: params.get('points') ? parseInt(params.get('points')) : 0
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      const flagKey = `welcomeShown_${user._id || user.email}`;
      const hasShown = localStorage.getItem(flagKey);
      if (!hasShown && user.points >= 500) {
        setShowPointsPopup(true);
        localStorage.setItem(flagKey, 'true');
      }

      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);

      const flagKey = `welcomeShown_${savedUser._id || savedUser.email}`;
      const hasShown = localStorage.getItem(flagKey);
      if (!hasShown && savedUser.points >= 500) {
        setShowPointsPopup(true);
        localStorage.setItem(flagKey, 'true');
      }
    }
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
    dots: false, // ✅ hide default slick dots
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    beforeChange: (_, next) => setCurrentPromo(next), // sync current slide
  };

  const promoBanners = [
    { img: "/fashion.png", category: "Clothing", statement: "👗 Fresh Fashion Trends Await!" },
    { img: "/food.png", category: "Food", statement: "🍔 Tasty Deals Just For You!" },
    { img: "/handbag.png", category: "Handbag", statement: "👜 Stylish Handbags at Best Points!" },
    { img: "/shoe.png", category: "Shoes", statement: "👟 Step Into Comfort & Style!" },
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Slider as background */}
      <div className="absolute inset-0 -z-10">
          <Slider ref={sliderRef} {...sliderSettings}>
            {promoBanners.map((promo, index) => (
              <div
                key={index}
                className="h-screen w-full cursor-pointer"
                onClick={() => navigate(`/voucher?category=${promo.category}`)}
              >
                <img
                  src={promo.img}
                  alt={promo.category}
                  className="w-full h-screen object-cover brightness-75"
                />
              </div>
            ))}
          </Slider>
      </div>

            {/* Overlay partition */}
      <main className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="bg-white text-gray-900 p-12 rounded-3xl shadow-2xl max-w-2xl w-full">
          <h2 className="text-3xl font-bold mb-4">
            👋 Hello
            {user
              ? user.firstName
                ? `, ${user.firstName}`
                : `, ${user.username}`
              : ''}!
          </h2>
          <p className="mb-6">Welcome to Optima Bank Dashboard</p>

          {user && (
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg cursor-pointer mb-6"
              onClick={() => navigate("/voucher")}
            >
              <h3 className="text-xl font-bold">🏆 Your Reward Points</h3>
              <p className="text-4xl font-extrabold mt-2">{user.points}</p>
              <p className="opacity-90 mt-1">Click to redeem vouchers</p>
            </div>
          )}

          {/* Promo statement */}
          <div
            className="text-lg font-semibold cursor-pointer hover:underline"
            onClick={() =>
              navigate(`/voucher?category=${promoBanners[currentPromo].category}`)
            }
          >
            {promoBanners[currentPromo].statement}
          </div>

            {/* ✅ Custom dots below promo statement */}
            <div className="flex justify-center mt-6 gap-2">
              {promoBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPromo(index);
                    sliderRef.current.slickGoTo(index); // ✅ move background too
                  }}
                  className={`h-3 w-3 rounded-full transition ${
                    currentPromo === index ? "bg-blue-600 scale-125" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
        </div>
      </main>


      {/* ✅ Welcome Points Popup */}
      {showPointsPopup && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative bg-white w-11/12 max-w-sm p-6 rounded-2xl shadow-xl text-center">
            <button
              aria-label="Close"
              className="absolute top-3 right-3 text-xl text-gray-600 hover:text-black"
              onClick={closeWelcome}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold">
              🎉 Welcome{user.firstName ? `, ${user.firstName}` : user.username ? `, ${user.username}` : ''}!
            </h2>
            <p className="mt-2">You’ve been granted</p>
            <p className="mt-1 text-4xl font-extrabold text-green-600">{user.points} points</p>
            <p className="mt-2 text-gray-600">Redeem them for exclusive vouchers.</p>

            <div className="mt-5 flex gap-3 justify-center">
              <button
                onClick={() => { setShowPointsPopup(false); navigate('/voucher'); }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Redeem now
              </button>
              <button
                onClick={closeWelcome}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
