// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'parent'
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (response?.data?.message) {
        alert(response.data.message);
      } else {
        alert('User registered successfully!');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form onSubmit={onSubmit} className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={onChange}
          required
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={onChange}
          required
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={onChange}
          required
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          name="role"
          onChange={onChange}
          className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
