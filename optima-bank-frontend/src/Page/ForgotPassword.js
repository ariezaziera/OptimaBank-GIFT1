import { useState } from 'react';
import AuthLayout from '../AuthLayout';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const baseURL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://optimabank-gift1.onrender.com";
  
    try {
      const res = await fetch(`${baseURL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Reset link has been sent to your email.");
      } else {
        alert(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      console.error("Error sending reset request:", err);
      alert("Something went wrong. Please try again later.");
    }
  };


  return (
    <AuthLayout>
        <div>
        <h2 className="text-white text-3xl font-bold text-center mb-6">Forgot Password</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name='email'
                    placeholder='Email'
                    className="w-full p-3 rounded-lg outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-white text-black font-bold py-2 w-1/2 mx-auto block rounded-full">
                    Send Reset Link
                </button>
            </form>
            </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
