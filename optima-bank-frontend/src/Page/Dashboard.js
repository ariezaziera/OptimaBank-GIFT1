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
  const [latestVouchers, setLatestVouchers] = useState([]); // ✅ new state
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

  // ✅ Fetch vouchers for promotions
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const baseURL =
          window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://optimabank-gift1.onrender.com";
  
        const res = await fetch(`${baseURL}/voucher`, { credentials: "include" });
        const data = await res.json();
  
        setLatestVouchers(data.slice(-3)); // ✅ take latest 3 vouchers
      } catch (err) {
        console.error("Failed to fetch vouchers:", err);
      }
    };
  
    fetchVouchers();
  }, []);


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


  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    beforeChange: (_, next) => setCurrentPromo(next),
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

      {/* Background slider */}
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
      <main className="flex flex-col items-center justify-center min-h-screen text-center p-8 pt-14">
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

          {/* ✅ Custom dots */}
          <div className="flex justify-center mt-6 gap-2">
            {promoBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPromo(index);
                  sliderRef.current.slickGoTo(index);
                }}
                className={`h-3 w-3 rounded-full transition ${
                  currentPromo === index ? "bg-blue-600 scale-125" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Latest Vouchers Section */}
      {latestVouchers.length > 0 && (
        <section className="relative z-10 bg-white py-12 px-6 md:px-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎁 Latest Vouchers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {latestVouchers.map(voucher => (
              <div
                key={voucher._id || voucher.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate("/voucher")}
              >
                <img
                  src={voucher.image}
                  alt={voucher.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-cyan-950">{voucher.name}</h3>
                  <p className="text-sm text-gray-500">Category: {voucher.category}</p>
                  <p className="text-gray-700 font-medium">Price: {voucher.price} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Welcome Popup */}
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
