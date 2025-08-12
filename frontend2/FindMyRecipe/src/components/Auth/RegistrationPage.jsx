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
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8}$/;

  const sendOtp = async () => {
    if (!name || !email || !password) {
      setMessage('❌ Please fill in all fields before sending OTP.');
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage('❌ Enter a valid email address.');
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setMessage('❌ Password must include uppercase, lowercase, number, and special character.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/send-email-otp-register', { email });
      if (res.data.success) {
        setOtpSent(true);
        setMessage('✅ OTP sent to your email.');
      } else {
        setMessage('❌ Failed to send OTP.');
      }
    } catch (err) {
      setMessage('❌ Error sending OTP.');
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
        setMessage('❌ OTP verification failed.');
      }
    } catch (err) {
      setMessage('❌ Verification failed. Try again later.');
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
            placeholder="Password"
            required
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
