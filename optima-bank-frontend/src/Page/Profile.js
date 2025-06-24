import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
    language: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    address: '',
    postcode: '',
    country: '',
    payment: '',
    profileImage: null
  });

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) return;
    setUser(savedUser);
  
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/profile/${savedUser._id}`);
        const data = await res.json();
  
        if (data) {
          setFormData(prev => ({
          ...prev,
          ...data,
          birthMonth: new Date(data.dob).getMonth() + 1,
          birthDay: new Date(data.dob).getDate(),
          birthYear: new Date(data.dob).getFullYear()
        }));
        setUserId(savedUser._id); // ✅ Correct MongoDB ObjectId
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
  
    fetchProfile();
  }, []);  

  // ✅ Logout function
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...formData };
      const dob = new Date(`${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`);
      updatedData.dob = dob;

      const form = new FormData();
      for (const key in updatedData) {
        if (key !== 'profileImage') {
          form.append(key, updatedData[key]);
        }
      }

      console.log("formData.profileImage =", formData.profileImage);

      if (formData.profileImage instanceof File) {
        form.append('profileImage', formData.profileImage);
      }

      const res = await fetch(`http://localhost:5000/profile/update/${userId}`, {
        method: 'PUT',
        body: form
      });

      if (res.ok) alert("Profile updated!");
      else alert("Update failed");
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="min-h-screen  pt-24" 
      style={{ backgroundImage: "url('/bgprofile.png')" }}
    >
    {/* Keep Navbar fixed to top */}
    <div className="fixed top-0 left-0 w-full z-10 bg-white shadow">
      <Navbar user={user} handleLogout={handleLogout} />
    </div>

    {/* Page Content */}
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          My Profile <span className="text-gray-500 font-normal">→ Edit Profile</span>
        </h2>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

    <div className="max-w-7xl mx-auto bg-cyan-950 opacity-70 rounded-3xl shadow-lg p-10 relative">
        <div className="flex items-center gap-8 mb-8">
          <div>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <img
              src={
                imagePreview ||
                (formData.profileImage?.startsWith('/uploads')
                  ? `http://localhost:5000${formData.profileImage}`
                  : formData.profileImage) || "/default-profile.png"
              }
              alt="User"
              className="w-24 h-24 rounded-full object-cover mt-2"
            />
          </div>
          <div>
            <p className="text-gray-700 font-semibold">User ID: {userId}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-white mb-1 ml-5 font-semibold">First Name</label>
          <input id="firstName" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-white mb-1 ml-5 font-semibold">Last Name</label>
          <input id="lastName" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-white mb-1 ml-5 font-semibold">Gender</label>
          <div className="relative">
            <select id="gender" name="gender" onChange={handleChange} value={formData.gender}
              className="w-full p-3 pl-5 pr-10 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white appearance-none"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">▼</div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-white mb-1 ml-5 font-semibold">Username</label>
          <input id="username" name="username" placeholder="Username" onChange={handleChange} value={formData.username}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Birth Month */}
        <div>
          <label htmlFor="birthMonth" className="block text-white mb-1 ml-5 font-semibold">Birth Month</label>
          <div className="relative">
            <select id="birthMonth" name="birthMonth" onChange={handleChange} value={formData.birthMonth}
              className="w-full p-3 pl-5 pr-10 rounded-3xl border-2 border-white bg-transparent text-white outline-none focus:ring-2 focus:ring-white appearance-none"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i+1}>{i+1}</option>)}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">▼</div>
          </div>
        </div>

        {/* Birth Day */}
        <div>
          <label htmlFor="birthDay" className="block text-white mb-1 ml-5 font-semibold">Birth Day</label>
          <div className="relative">
            <select id="birthDay" name="birthDay" onChange={handleChange} value={formData.birthDay}
              className="w-full p-3 pl-5 pr-10 rounded-3xl border-2 border-white bg-transparent text-white outline-none focus:ring-2 focus:ring-white appearance-none"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => <option key={i} value={i+1}>{i+1}</option>)}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">▼</div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-white mb-1 ml-5 font-semibold">Password</label>
          <input id="password" name="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Birth Year */}
        <div>
          <label htmlFor="birthYear" className="block text-white mb-1 ml-5 font-semibold">Birth Year</label>
          <div className="relative">
            <select id="birthYear" name="birthYear" onChange={handleChange} value={formData.birthYear}
              className="w-full p-3 pl-5 pr-10 rounded-3xl border-2 border-white bg-transparent text-white outline-none focus:ring-2 focus:ring-white appearance-none"
            >
              <option value="">Year</option>
              {Array.from({ length: 50 }, (_, i) => <option key={i} value={2025 - i}>{2025 - i}</option>)}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">▼</div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white mb-1 ml-5 font-semibold">Email</label>
          <input id="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-white mb-1 ml-5 font-semibold">Phone</label>
          <input id="phone" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone}
            className="w-full p-3 pl-5 rounded-3xl border-2 border-white bg-transparent text-white placeholder-white outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
