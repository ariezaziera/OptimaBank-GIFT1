import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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
  };

  const handleRedeem = async (item) => {
    if (!user) return alert("Sila login terlebih dahulu");

    try {
      const res = await fetch('http://localhost:5000/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          voucher: {
            ...item,
            quantity: item.quantity || 1,
            price: item.price * (item.quantity || 1)
          }
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Redeem Successull!");
        const updatedUser = { ...user, points: data.points };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        const updatedCart = cartItems.filter(v => v.id !== item.id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error while redeeming voucher.");
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Cart is still empty. Please redeem a voucher first.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRedeem(item)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Redeem
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
