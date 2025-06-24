import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ user, handleLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = (path) =>
    `px-4 py-1 rounded-md hover:underline ${
      currentPath === path ? 'opacity-50 font-semibold' : ''
    }`;

  return (
    <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 text-black z-10">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8" />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 mr-10">
        {user ? (
          <>
            {/* Authenticated user: Home first */}
            <Link to="/dashboard" className={linkClass('/dashboard')}>Home</Link>
            <Link to="/vouchers" className={linkClass('/vouchers')}>Vouchers</Link>
            <Link to="/rewards" className={linkClass('/rewards')}>Rewards</Link>
            <Link to="/cart" className={linkClass('/cart')}>Cart</Link>
            <Link to="/history" className={linkClass('/history')}>History</Link>
            <Link to="/about" className={linkClass('/about')}>About Us</Link>
            <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest: About Us first */}
            <Link to="/about" className={linkClass('/about')}>About Us</Link>
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
    </nav>
  );
}
