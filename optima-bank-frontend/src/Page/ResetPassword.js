// src/pages/ResetPassword.js
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthLayout from '../AuthLayout';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
  
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://optimabank-gift1.onrender.com"; // 🟢 deployed backend
  
    try {
      const res = await fetch(`${baseURL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
  
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error resetting password.");
      console.error("Reset password error:", err);
    }
  };


  return (
    <AuthLayout>
        <h2 className="text-white text-3xl font-bold text-center mb-6">Reset Your Password</h2>
            <form onSubmit={handleReset} className="space-y-4">
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-yellow-700 text-white p-2 rounded">
                    Reset Password
                </button>
                {message && <p className="mt-4 text-center">{message}</p>}
            </form>
    </AuthLayout>
  );
}

export default ResetPassword;
