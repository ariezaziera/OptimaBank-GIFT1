// src/Page/Voucher.js
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const sampleVouchers = [
      {
        id: "1",
        name: "RM15 Off Shirt",
        price: 300,
        image: '/1.png',
        category: 'Clothing',
        description: 'Enjoy RM10 discount on selected clothing.',
        terms: 'Valid through 30 December. T&Cs apply.'
      },
      {
        id: "2",
        name: "Free Fried Chicken",
        price: 200,
        image: '/2.png',
        category: 'Food',
        description: 'Enjoy a free fried chicken at selected restaurants.',
        terms: 'Redeemable at participating outlets. Valid for single use only.'
      },
      {
        id: "3",
        name: "20% Off Handbag",
        price: 250,
        image: '/3.png',
        category: 'Handbag',
        description: 'Get 20% off all Brand X handbags.',
        terms: 'Valid at Brand X boutiques. Not valid with other promotions.'
      },
      {
        id: "4",
        name: "RM20 Off Shoes",
        price: 180,
        image: '/4.png',
        category: 'Shoes',
        description: 'Enjoy RM20 discount on selected sports shoes.',
        terms: 'Available while sizes and stocks last.'
      },
    ];
    setVouchers(sampleVouchers);
    setFilteredVouchers(sampleVouchers);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredVouchers(vouchers);
    } else {
      setFilteredVouchers(vouchers.filter(v => v.category === category));
    }
  };

  const addToCart = (voucher) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find(item => item.id === voucher.id);
    if (exists) {
      alert('This voucher is already in the cart.');
      return;
    }
    cart.push({ ...voucher, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Voucher was added to cart!');
    setSelectedVoucher(null);
  };

  const handleRedeem = async () => {
    try {
      selectedVoucher.price = Number(selectedVoucher.price);
      const res = await fetch('http://localhost:5000/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, voucher: selectedVoucher })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Redeem Successfull!');
        const updatedUser = { ...user, points: data.points };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSelectedVoucher(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error while redeeming voucher.");
    }
  };

  const categories = ['All', 'Clothing', 'Food', 'Handbag', 'Shoes'];

  return (
    <>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto p-4 mt-24">
        <center><h2 className="text-3xl font-bold mb-6">Voucher List</h2></center>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full border font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white rounded-2xl shadow p-4">
              <img
                src={voucher.image}
                alt={voucher.name}
                onClick={() => setSelectedVoucher(voucher)}
                className="w-full aspect-square object-cover rounded-xl mb-4 cursor-pointer"
              />
              <h3 className="text-lg font-semibold">{voucher.name}</h3>
              <p className="text-sm text-gray-500">Category: {voucher.category}</p>
              <p className="text-gray-600 mb-2">Price: {voucher.price} pts</p>
              <button
                onClick={() => setSelectedVoucher(voucher)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[500px] relative">
            <button
              onClick={() => setSelectedVoucher(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <img
              src={selectedVoucher.image}
              alt={selectedVoucher.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedVoucher.name}</h2>
            <p className="text-gray-500 mb-1">Category: {selectedVoucher.category}</p>
            <p className="mb-2 font-medium">Price: {selectedVoucher.price} pts</p>
            <p className="text-sm mb-2"><strong>Description:</strong> {selectedVoucher.description}</p>
            <p className="text-sm mb-4"><strong>Terms & Conditions:</strong> {selectedVoucher.terms}</p>
            <button
              onClick={handleRedeem}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mb-2"
            >
              Claim
            </button>
            <button
              onClick={() => addToCart(selectedVoucher)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Voucher;
