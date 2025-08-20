// src/Page/Voucher.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';   // ✅ import here
import Navbar from '../Navbar';

const Voucher = () => {
  const location = useLocation(); // ✅ must be inside component
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch('http://localhost:5000/voucher');
        const data = await res.json();
        setVouchers(data);

        // ✅ Read query param ?category=Clothing
        const params = new URLSearchParams(location.search);
        const categoryFromUrl = params.get('category');

        if (categoryFromUrl && categoryFromUrl !== 'All') {
          setSelectedCategory(categoryFromUrl);
          setFilteredVouchers(data.filter(v => v.category === categoryFromUrl));
        } else {
          setFilteredVouchers(data);
        }
      } catch (err) {
        console.error("Failed to fetch vouchers:", err);
      }
    };
    fetchVouchers();
  }, [location.search]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterVouchers(searchTerm, category);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterVouchers(value, selectedCategory);
  };

  const filterVouchers = (search, category) => {
    let result = vouchers;

    if (category !== 'All') {
      result = result.filter(v => v.category === category);
    }

    if (search.trim() !== '') {
      result = result.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredVouchers(result);
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

  const categories = ['All', 'Clothing', 'Food', 'Handbag', 'Shoes'];

  return (
    <>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto p-4 mt-24">
        <center><h2 className="text-3xl font-bold mb-6">Voucher List</h2></center>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {categories.map(category => (
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

        {/* Search bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search vouchers..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Voucher Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVouchers.map(voucher => (
            <div
              key={voucher._id || voucher.id}
              className={`bg-white rounded-2xl shadow p-4 ${
                voucher.available === 0 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <img
                src={voucher.image}
                alt={voucher.name}
                onClick={() => setSelectedVoucher(voucher)}
                className="w-full aspect-square object-cover rounded-xl mb-4 cursor-pointer"
              />
              <h3 className="text-lg font-semibold">{voucher.name}</h3>
              <p className="text-sm text-gray-500">Category: {voucher.category}</p>
              <p className="text-gray-600 mb-2">Price: {voucher.price} pts</p>
              <p className="text-red-600 font-medium mb-2">Available: {voucher.available}</p>

              {/* Buttons side by side */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedVoucher(voucher)}
                  disabled={voucher.available === 0}
                  className={`flex-1 px-4 py-1 rounded text-white ${
                    voucher.available === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {voucher.available === 0 ? 'Unavailable' : 'Details'}
                </button>
                <button
                  onClick={() => addToCart(voucher)}
                  disabled={voucher.available === 0}
                  className={`flex-1 px-4 py-1 rounded text-white ${
                    voucher.available === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
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

            {/* Only Add to Cart button here */}
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
