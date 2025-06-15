import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!emailRegex.test(email)) {
      setMessage('❌ Please enter a valid email address.');
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setMessage(
        '❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/register', {
        name,
        email,
        password,
      });
      setMessage(res.data.success ? '✅ Registration successful!' : '❌ Registration failed');
    } catch (err) {
      console.error(err);
      setMessage('❌ Signup failed. Try again later.');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      {/* Register Card */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-12 w-full max-w-xl border-t-8 border-indigo-500 text-black">
        <h1 className="text-4xl font-extrabold text-center text-black mb-4">
          🥗 Join Find My Recipe
        </h1>
        <p className="text-center text-black text-lg mb-8">
          Create your account and start discovering amazing recipes.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password (8+ chars, upper, lower, number, special)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl transition duration-300"
          >
            📝 Sign Up
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="px-4 text-black text-sm">or</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="mt-6 w-full py-3 bg-white border border-gray-300 text-black font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-6 h-6"
          />
          Sign up with Google
        </button>

        {message && (
          <p className="mt-6 text-center text-red-600 font-semibold text-lg">{message}</p>
        )}

        <p className="mt-8 text-center text-base text-black">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-500 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
