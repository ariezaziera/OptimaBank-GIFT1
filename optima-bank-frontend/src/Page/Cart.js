// src/Page/Cart.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // ✅ track selected vouchers

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

  // ✅ Toggle selection
  const handleCheckboxChange = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // ✅ Bulk redeem
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
            _id: item._id,  // use database id
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

        // remove redeemed vouchers from cart
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
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Cart is still empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white shadow-md p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">Category: {item.category}</p>
                      <p className="text-sm font-medium">Points per unit: {item.price}</p>
                      <div className="mt-2">
                        <label className="mr-2">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          max="3"
                          value={item.quantity || 1}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-16 border rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ Single redeem button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBulkRedeem}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Redeem Selected
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
