import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];

    // Rule 1: Exactly 8 characters long
    if (password.length !== 8) {
      errors.push('must be exactly 8 characters long');
    }

    // Rule 2: Must include an uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('must include an uppercase letter');
    }

    // Rule 3: Must include a lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('must include a lowercase letter');
    }

    // Rule 4: Must include a digit
    if (!/\d/.test(password)) {
      errors.push('must include a digit');
    }

    // Rule 5: Must include a special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('must include a special character');
    }

    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // New validation logic
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage(`❌ Password error: ${passwordErrors.join(', ')}.`);
      return;
    }

    setMessage(''); // Clear previous messages before trying to log in

    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        setMessage('✅ Login successful!');
        setTimeout(() => {
          navigate('/home');
        }, 2000);

      } else {
        setMessage(`❌ ${res.data.message || 'Invalid credentials'}`);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Login failed. Try again later.';
      setMessage(`❌ ${errorMessage}`);
    }
  };

  const handleGoogleLogin = () => {
    const origin = window.location.origin;
    const popup = window.open(
      `https://recipe-api-k26hqvqwva-uc.a.run.app/auth/google-login?origin=${origin}`,
      'googleLogin',
      'width=500,height=600'
    );

    const listener = (event) => {
      if (event.origin !== 'https://recipe-api-k26hqvqwva-uc.a.run.app') return;

      const { token, message } = event.data;
      console.log('Received message:', event.data);
      console.log('Token:', token);
      console.log('Message:', message);

      if (token) {
        localStorage.setItem('token', token);
        setMessage('✅ ' + message);
        popup?.close();
        window.removeEventListener('message', listener);
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      }
    };

    window.addEventListener('message', listener);
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
            placeholder="Password (8 chars, A-Z, a-z, 0-9, !@#..)"
            required
            maxLength={8} // ✅ THIS IS THE NEW LINE
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />

          <div className="text-right text-sm">
            <a href="/forgot" className="text-indigo-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl transition duration-300"
          >
            🍕 Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 text-lg text-black bg-white border border-gray-300 hover:bg-gray-100 font-semibold rounded-xl transition duration-300 flex items-center justify-center"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-6 w-6 mr-3"
            />
            Continue with Google
          </button>
        </div>

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