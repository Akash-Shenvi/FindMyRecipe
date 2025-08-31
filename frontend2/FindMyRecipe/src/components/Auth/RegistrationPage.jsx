import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePassword = (password) => {
    const errors = [];
    if (password.length !== 8) {
      errors.push('be exactly 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('contain an uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('contain a lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('contain a digit');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('contain a special character');
    }
    return errors;
  };

  const sendOtp = async () => {
    if (!name || !email || !password) {
      setMessage('❌ Please fill in all fields before sending OTP.');
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage('❌ Enter a valid email address.');
      return;
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage(`❌ Password must: ${passwordErrors.join(', ')}.`);
      return;
    }
    
    setMessage('');
    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/send-email-otp-register', { email });
      if (res.data.success) {
        setOtpSent(true);
        setMessage('✅ OTP sent to your email.');
      } else {
        setMessage(`❌ ${res.data.message || 'Failed to send OTP.'}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error sending OTP.';
      setMessage(`❌ ${errorMessage}`);
    }
    setIsLoading(false);
  };

  const verifyAndRegister = async () => {
    if (!otp) {
      setMessage('❌ Please enter the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/register', {
        name,
        email,
        password,
        otp,
      });

      if (res.data.success) {
        setMessage('✅ Registration successful!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${res.data.message || 'OTP verification failed.'}`);
      }
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Verification failed. Try again later.';
        setMessage(`❌ ${errorMessage}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 w-full max-w-xl border-t-8 border-indigo-500 text-black">
        <h1 className="text-3xl font-extrabold text-center mb-6">🥗 Join Find My Recipe</h1>

        <div className="space-y-6">
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
            placeholder="Email Address"
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

          {!otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={isLoading}
              className={`w-full py-4 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'
              } text-black font-bold rounded-xl transition duration-300`}
            >
              {isLoading ? 'Sending OTP...' : '📤 Send OTP'}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={verifyAndRegister}
                disabled={isLoading}
                className={`w-full py-4 ${
                  isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                } text-white font-bold rounded-xl transition duration-300`}
              >
                {isLoading ? 'Verifying...' : '✅ Verify OTP & Register'}
              </button>
            </>
          )}

          {message && (
            <p className="text-center text-red-600 font-semibold text-lg">{message}</p>
          )}

          <p className="text-center text-base text-black mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-500 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;