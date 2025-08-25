import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function History() {
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil user dari localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      fetchRedeemed(savedUser._id);
    }
  }, []);

  const fetchRedeemed = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/redeemed/${userId}`);
      const data = await res.json();
      setRedeemedVouchers(data || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

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
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Redeem History</h2>

        {redeemedVouchers.length === 0 ? (
          <p className="text-gray-600 text-center">No vouchers have been redeemed.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {redeemedVouchers.map((voucher, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4">
                <img
                  src={voucher.image}
                  alt={voucher.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">{voucher.name}</h3>
                <p className="text-sm text-gray-600">Price: {voucher.price} pts</p>
                <p className="text-sm text-gray-500">
                  Claimed: {new Date(voucher.redeemedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
