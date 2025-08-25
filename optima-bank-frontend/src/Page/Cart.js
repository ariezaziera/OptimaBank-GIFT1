// src/Page/Cart.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const newCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.min(quantity, 3) } : item
    );
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setSelectedItems(prev => prev.filter(sid => sid !== id));
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleBulkRedeem = async () => {
    if (!user) return alert("Please login first");
    if (selectedItems.length === 0) return alert("No vouchers selected");

    const vouchersToRedeem = cartItems.filter(item => selectedItems.includes(item.id));

    try {
      const res = await fetch("http://localhost:5000/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          vouchers: vouchersToRedeem.map(item => ({
            _id: item._id,
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
          }))
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Redeem Successful!");
        const updatedUser = { ...user, points: data.points };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        const updatedCart = cartItems.filter(item => !selectedItems.includes(item.id));
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setSelectedItems([]);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error while redeeming vouchers.");
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
      <div className="pt-28 px-6 max-w-6xl mx-auto min-h-screen mb-10">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-cyan-950 tracking-tight">
          🛒 Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-xl">Your cart is still empty.</p>
            <p className="text-sm mt-2">Go add some vouchers 😉</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 shadow-lg rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-6">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-5 h-5 accent-green-600"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Category: {item.category}</p>
                      <p className="text-sm font-medium text-cyan-700">
                        Points per unit: {item.price}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          max="3"
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-20 border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleBulkRedeem}
                className="bg-green-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-green-700 transition"
              >
                ✅ Redeem Selected
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
