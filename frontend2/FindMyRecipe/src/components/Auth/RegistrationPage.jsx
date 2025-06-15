import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [useOtp, setUseOtp] = useState(false); // Toggle between Email or OTP
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/send-otp', { mobile });
      if (res.data.success) {
        setOtpSent(true);
        setMessage('✅ OTP sent to your mobile');
      } else {
        setMessage('❌ Failed to send OTP');
      }
    } catch (err) {
      setMessage('❌ Error sending OTP');
    }
  };

  const handleOtpVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/verify-otp', {
        name,
        mobile,
        otp,
      });
      setMessage(res.data.success ? '✅ Registration successful!' : '❌ OTP verification failed');
    } catch (err) {
      setMessage('❌ OTP verification failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setMessage('❌ Please enter a valid email address.');
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setMessage('❌ Password must include uppercase, lowercase, number, and special character.');
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
      setMessage('❌ Signup failed. Try again later.');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-gray-100">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-12 w-full max-w-xl border-t-8 border-indigo-500 text-black">
        <h1 className="text-4xl font-extrabold text-center text-black mb-4">
          🥗 Join Find My Recipe
        </h1>

        <div className="flex justify-center mb-6 gap-4 text-sm">
          <button
            className={`px-4 py-2 rounded-full ${!useOtp ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUseOtp(false)}
          >
            Register with Email
          </button>
          <button
            className={`px-4 py-2 rounded-full ${useOtp ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setUseOtp(true)}
          >
            Register with Mobile OTP
          </button>
        </div>

        <form onSubmit={useOtp ? (e) => { e.preventDefault(); handleOtpVerify(); } : handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />

          {!useOtp ? (
            <>
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
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Mobile Number"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              />
              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition duration-300"
                >
                  📤 Send OTP
                </button>
              ) : (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-6 py-4 text-lg text-black rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
                />
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl transition duration-300"
          >
            {useOtp ? '✅ Verify OTP & Register' : '📝 Sign Up'}
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
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
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
