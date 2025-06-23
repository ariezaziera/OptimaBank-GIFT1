import React, { useState, useEffect } from 'react';

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

  const [userId, setUserId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
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
          setUserId(`${data.username}${data.lastName}`);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

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

      if (formData.profileImage) {
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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 p-6 text-gray-900">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 relative">
        <div className="absolute right-10 top-10">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold" onClick={handleSave}>Save</button>
        </div>
        <h2 className="text-2xl font-bold mb-4">My Profile <span className="text-gray-500 font-normal">→ Edit Profile</span></h2>

        <div className="flex items-center gap-8 mb-8">
          <div>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt="User"
              className="w-24 h-24 rounded-full object-cover mt-2"
            />
          </div>
          <div>
            <p className="text-gray-700 font-semibold">User ID: {userId}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="input" />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="input" />
          <select name="gender" onChange={handleChange} value={formData.gender} className="input">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input name="username" placeholder="Username" onChange={handleChange} value={formData.username} className="input" />
          <select name="birthMonth" onChange={handleChange} value={formData.birthMonth} className="input">
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i+1}>{i+1}</option>)}
          </select>
          <select name="birthDay" onChange={handleChange} value={formData.birthDay} className="input">
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => <option key={i} value={i+1}>{i+1}</option>)}
          </select>

          <input name="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password} className="input" />
          <select name="birthYear" onChange={handleChange} value={formData.birthYear} className="input">
            <option value="">Year</option>
            {Array.from({ length: 50 }, (_, i) => <option key={i} value={2025 - i}>{2025 - i}</option>)}
          </select>
          <select name="language" onChange={handleChange} value={formData.language} className="input">
            <option value="">Language</option>
            <option value="en">English</option>
            <option value="ms">Malay</option>
          </select>

          <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="input" />
          <input name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="input" />
          <input name="address" placeholder="Address" onChange={handleChange} value={formData.address} className="input" />

          <input name="postcode" placeholder="Postcode" onChange={handleChange} value={formData.postcode} className="input" />
          <input name="country" placeholder="Country" onChange={handleChange} value={formData.country} className="input" />
          <input name="payment" placeholder="Payment" onChange={handleChange} value={formData.payment} className="input" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
