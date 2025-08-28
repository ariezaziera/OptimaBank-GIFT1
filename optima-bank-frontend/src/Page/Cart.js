// src/Page/Cart.js
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "../index.css"; // ✅ ensure print styles are included
import Barcode from "react-barcode";


export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const newCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(quantity, 3) } : item
    );
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      const res = await fetch('http://localhost:5000/logout', { method: 'GET', credentials: 'include' });
      if (res.ok) {
        localStorage.removeItem('user');
        window.location.href = 'http://localhost:3000/';
      } else console.error('Logout failed:', await res.json());
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems((prev) => prev.filter((sid) => sid !== id));
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ✅ Select All toggle
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // ✅ Generate unique serial tied to voucher globally
  const generateSerial = (voucher) => {
    const prefixes = {
      Clothing: "CLTH",
      Food: "FOOD",
      Handbag: "HDBG",
      Shoes: "SHOE",
    };
    const prefix = prefixes[voucher.category] || "GEN";

    // Use voucher ID or name hash for consistent part
    const baseCode = (voucher.id || voucher.name)
      .toUpperCase()
      .replace(/\s+/g, "")
      .substr(0, 5);

    // Add random suffix for uniqueness
    const uniquePart = Math.random().toString(36).substr(2, 5).toUpperCase();

    return `${prefix}-${baseCode}-${uniquePart}`;
  };

  const handleBulkRedeem = async () => {
    if (!user) return alert("Please login first");
    if (selectedItems.length === 0) return alert("No vouchers selected");

    const vouchersToRedeem = cartItems.filter(item => selectedItems.includes(item.id));

    // Generate serials **once**
    const redeemedVouchersList = [];
    const vouchersForBackend = vouchersToRedeem.map(item => {
      const serials = Array.from({ length: item.quantity || 1 }, () => generateSerial(item));
      
      // Push for modal display
      serials.forEach(s => {
        redeemedVouchersList.push({
          ...item,
          serial: s,
          redeemedAt: new Date()
        });
      });

      return {
        _id: item._id,
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity || 1,
        serials
      };
    });

    setRedeemedVouchers(redeemedVouchersList);
    setShowVoucherModal(true);

    try {
      // Update stock
      // Update stock + save to user
      const resStock = await fetch("http://localhost:5000/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          vouchers: vouchersForBackend   // ✅ already has serials
        })
      });


      const dataStock = await resStock.json();
      if (!resStock.ok) return alert(dataStock.message || "Error updating stock");

      // Push redeemed serials to backend
      const resRedeemed = await fetch("http://localhost:5000/redeemed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          vouchers: vouchersForBackend
        })
      });

      const dataRedeemed = await resRedeemed.json();
      if (!resRedeemed.ok) return alert(dataRedeemed.message || "Error saving redeemed vouchers");

      // Clear cart after success
      const updatedCart = cartItems.filter(item => !selectedItems.includes(item.id));
      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setSelectedItems([]);

      if (dataStock.points) {
        const updatedUser = { ...user, points: dataStock.points };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong while redeeming vouchers.");
    }
  };


  return (
    <>
      {/* ✅ Navbar hidden in print */}
      <div className="no-print">
      <Navbar user={user} handleLogout={handleLogout} />
      </div>

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
            {/* ✅ Select All Checkbox */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-gray-700 font-medium">Select All</span>
            </div>

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
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Category: {item.category}
                      </p>
                      <p className="text-sm font-medium text-cyan-700">
                        Points per unit: {item.price}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <label className="text-sm text-gray-600">
                          Quantity:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="3"
                          value={item.quantity || 1}
                          onChange={(e) =>
                            handleQuantityChange(item.id, Number(e.target.value))
                          }
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

      {/* ✅ Voucher Popup Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center overflow-auto pt-14">
          <div className="bg-white p-6 px-12 rounded-lg max-w-2xl w-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
              🎟️ Your Redeemed Vouchers
            </h2>

            {(() => {
              // Group vouchers by name
              const grouped = {};
              redeemedVouchers.forEach((v) => {
                if (!grouped[v.name]) {
                  grouped[v.name] = { ...v, serials: [] };
                }
                grouped[v.name].serials.push(v.serial);
              });

              const groupedVouchers = Object.values(grouped);

              // ✅ responsive columns
              const gridCols =
                groupedVouchers.length === 1
                  ? "grid-cols-1"
                  : groupedVouchers.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3";

            return (
              <div className="voucher-grid flex flex-wrap justify-center gap-4">
                {groupedVouchers.map((v, i) => (
                  <div
                    key={i}
                    className="voucher-card border p-4 rounded-lg shadow flex min-w-[300px] max-w-[600px] gap-4"
                  >
                    {/* Left side: image */}
                    <div className="flex-shrink-0 flex items-center">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-36 h-36 object-contain"
                      />
                    </div>

                    {/* Right side: details */}
                    <div className="flex-1">
                      <h3 className="voucher-title font-semibold text-lg mb-2">
                        {v.name} (x{v.serials.length})
                      </h3>

                      <div className="text-sm text-gray-700 space-y-1 mb-3">
                        <p>
                          <span className="font-semibold">Points:</span> {v.price}
                        </p>
                        {v.description && (
                          <p>
                            <span className="font-semibold">Description:</span>{" "}
                            {v.description}
                          </p>
                        )}
                        {v.terms && (
                          <p>
                            <span className="font-semibold">T&amp;C:</span> {v.terms}
                          </p>
                        )}
                      </div>

                      <div className="voucher-details flex flex-wrap gap-2">
                        {v.serials.map((s, j) => (
                          <div key={j} className="flex flex-col items-center">
                            <Barcode
                              value={s}
                              width={1.5}
                              height={50}
                              fontSize={12}
                            />
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Claimed at: {new Date(v.redeemedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
            })()}

            {/* ✅ Buttons hidden in print */}
            <div className="no-print text-center mt-6">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Print Voucher
              </button>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}