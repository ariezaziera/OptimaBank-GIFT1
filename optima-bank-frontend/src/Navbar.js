import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, handleLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      currentPath === path
        ? "text-white bg-cyan-900"
        : "text-gray-700 hover:text-white hover:bg-cyan-800"
    }`;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="text-xl font-bold flex items-center"
          >
            <img src="/logo.png" alt="Logo" className="h-8" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 mr-10">
            {user ? (
              <>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  Home
                </Link>
                <Link to="/AboutUs" className={linkClass("/AboutUs")}>
                  About Us
                </Link>
                <Link to="/voucher" className={linkClass("/voucher")}>
                  Vouchers
                </Link>
                <Link to="/cart" className={linkClass("/cart")}>
                  Cart
                </Link>
                <Link to="/history" className={linkClass("/history")}>
                  History
                </Link>
                <Link to="/profile" className={linkClass("/profile")}>
                  Profile
                </Link>
                <span className="text-gray-700 font-medium">
                  Hi, {user.firstName ? user.firstName : user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/AboutUs" className={linkClass("/AboutUs")}>
                  About Us
                </Link>
                {currentPath !== "/login" ? (
                  <Link
                    to="/login"
                    className="bg-cyan-950 text-white font-semibold px-4 py-1 rounded-md hover:bg-gray-800"
                  >
                    Login
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="bg-cyan-950 text-white font-semibold px-4 py-1 rounded-md hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-cyan-900 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-3 space-y-2 shadow-md">
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Home
              </Link>
              <Link to="/AboutUs" className={linkClass("/AboutUs")}>
                About Us
              </Link>
              <Link to="/voucher" className={linkClass("/voucher")}>
                Vouchers
              </Link>
              <Link to="/cart" className={linkClass("/cart")}>
                Cart
              </Link>
              <Link to="/history" className={linkClass("/history")}>
                History
              </Link>
              <Link to="/profile" className={linkClass("/profile")}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/AboutUs" className={linkClass("/AboutUs")}>
                About Us
              </Link>
              {currentPath !== "/login" ? (
                <Link
                  to="/login"
                  className="w-full block bg-cyan-950 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-800 text-center"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="w-full block bg-cyan-950 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-800 text-center"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
