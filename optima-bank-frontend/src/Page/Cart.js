import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [user, setUser] = useState(null); // ✅ Tambah state user

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setTotalPoints(total);

    // ✅ Ambil user dari localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleRemoveFromCart = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <>
      <Navbar user={user} /> {/* ✅ Pass user to Navbar */}
      <div className="pt-24 px-6">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow p-4 rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">ID: {item.id}</p>
                  <p className="text-sm font-medium">Points: {item.price}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="mt-6 text-right font-bold">Total Points: {totalPoints}</div>
          </div>
        )}
      </div>
    </>
  );
}
