import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage('❌ Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });
      setMessage(res.data.success ? '✅ Login successful!' : '❌ Invalid credentials');
    } catch (err) {
      console.error(err);
      setMessage('❌ Login failed. Try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-12 w-full max-w-xl border-t-8 border-indigo-500 text-black">
        <h1 className="text-4xl font-extrabold text-center text-black mb-4">
          🍽️ Find My Recipe
        </h1>
        <p className="text-center text-black text-lg mb-8">
          Welcome back! Login to explore delicious recipes.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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
            placeholder="Password (min 8 characters)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl transition duration-300"
          >
            🍕 Login
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-red-600 font-semibold text-lg">{message}</p>
        )}

        <p className="mt-8 text-center text-base text-black">
          Don’t have an account?{' '}
          <a href="/register" className="text-indigo-500 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
