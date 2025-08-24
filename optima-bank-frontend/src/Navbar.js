import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ user, handleLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false); // ✅ toggle state

  const linkClass = (path) =>
    `block px-4 py-2 rounded-md hover:underline ${
      currentPath === path ? 'opacity-50 font-semibold' : ''
    }`;

  return (
    <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 text-black z-10 bg-white shadow-md">
      {/* Logo */}
      <Link to="/dashboard" className="text-xl font-bold flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </Link>

      {/* Hamburger Button (only on mobile) */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✖' : '☰'}
      </button>

      {/* Navigation Links (desktop) */}
      <div className="hidden md:flex items-center gap-4 mr-10">
        {user ? (
          <>
            <Link to="/dashboard" className={linkClass('/dashboard')}>Home</Link>
            <Link to="/about-us" className={linkClass('/about-us')}>About Us</Link>
            <Link to="/voucher" className={linkClass('/voucher')}>Vouchers</Link>
            <Link to="/cart" className={linkClass('/cart')}>Cart</Link>
            <Link to="/history" className={linkClass('/history')}>History</Link>
            <Link to="/profile" className={linkClass('/profile')}>Profile</Link>

            <span className="text-gray-700 font-medium">Hi, {user.username}</span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/about-us" className={linkClass('/about-us')}>About Us</Link>
            <Link
              to="/signup"
              className={`bg-cyan-950 text-white font-semibold px-4 py-1 rounded-md hover:bg-gray-800 ${
                currentPath === '/signup' ? 'opacity-50' : ''
              }`}
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-start p-4 gap-3">
          {user ? (
            <>
              <span className="text-gray-700 font-medium px-4">Hi, {user.username}</span>
              <Link to="/dashboard" className={linkClass('/dashboard')} onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about-us" className={linkClass('/about-us')} onClick={() => setIsOpen(false)}>About Us</Link>
              <Link to="/voucher" className={linkClass('/voucher')} onClick={() => setIsOpen(false)}>Vouchers</Link>
              <Link to="/cart" className={linkClass('/cart')} onClick={() => setIsOpen(false)}>Cart</Link>
              <Link to="/history" className={linkClass('/history')} onClick={() => setIsOpen(false)}>History</Link>
              <Link to="/profile" className={linkClass('/profile')} onClick={() => setIsOpen(false)}>Profile</Link>


              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about-us" className={linkClass('/about-us')} onClick={() => setIsOpen(false)}>About Us</Link>
              <Link
                to="/signup"
                className={`bg-cyan-950 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-800 w-full text-left ${
                  currentPath === '/signup' ? 'opacity-50' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
