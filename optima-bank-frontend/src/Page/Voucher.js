import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [user, setUser] = useState(null);

  // Semak user login dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Dummy data - boleh tukar kepada fetch dari backend nanti
  useEffect(() => {
    const sampleVouchers = [
      {
        id: "1",
        name: "RM10 Discount Voucher",
        price: 200,
        image: '/1.png'
      },
      {
        id: "2",
        name: "Free Shipping Voucher",
        price: 180,
        image: '/2.png'
      },
      {
        id: "3",
        name: "20% Discount Voucher",
        price: 250,
        image: '/3.png'
      },
      {
        id: "4",
        name: "RM10 Discount Voucher",
        price: 300,
        image: '/4.png'
      },
    ];
    setVouchers(sampleVouchers);
  }, []);

  const addToCart = (voucher) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Elak duplicate ID
    const existing = cart.find(item => item.id === voucher.id);
    if (existing) {
      alert('Voucher ini sudah ada dalam cart.');
      return;
    }

    const newCart = [...cart, { ...voucher, quantity: 1 }];
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Voucher ditambah ke cart!');
  };

  return (
    <>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto p-4 mt-20">
        <center><h2 className="text-3xl font-bold mb-6">Senarai Voucher</h2></center>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white rounded-2xl shadow p-4">
              <img
                src={voucher.image}
                alt={voucher.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold">{voucher.name}</h3>
              <p className="text-gray-600 mb-2">Harga: {voucher.price} pts</p>
              <button
                onClick={() => addToCart(voucher)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                Add to Cart
                </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Voucher;
