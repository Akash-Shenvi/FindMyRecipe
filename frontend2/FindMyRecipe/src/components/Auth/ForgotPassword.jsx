import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ Common loading state

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/send-email-otp-forgotpassword', {
        email: emailOrMobile,
      });

      if (res.data.success) {
        setStep(2);
        setMessage('✅ OTP sent successfully!');
      } else {
        setMessage('❌ Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error sending OTP');
    }
    setIsLoading(false);
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/forgot-password/verify-otp', {
        identifier: emailOrMobile,
        otp,
      });

      if (res.data.success) {
        setStep(3);
        setMessage('✅ OTP verified. Now reset your password.');
      } else {
        setMessage('❌ Invalid OTP');
      }
    } catch (err) {
      setMessage('❌ OTP verification failed');
    }
    setIsLoading(false);
  };

  const resetPassword = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/auth/forgot-password/reset', {
        identifier: emailOrMobile,
        newPassword,
      });

      if (res.data.success) {
        setMessage('✅ Password reset successfully! You can now log in.');
        setStep(1);
        setEmailOrMobile('');
        setOtp('');
        setNewPassword('');
      } else {
        setMessage('❌ Password reset failed');
      }
    } catch (err) {
      setMessage('❌ Error resetting password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-black border-t-8 border-indigo-500">
        <h2 className="text-3xl font-bold mb-6 text-center">🔒 Forgot Password</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="w-full px-4 py-3 mb-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />
            <button
              onClick={sendOtp}
              disabled={isLoading}
              className={`w-full py-3 font-bold rounded-xl transition duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isLoading ? '📤 Sending OTP...' : '📤 Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className={`w-full py-3 font-bold rounded-xl transition duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isLoading ? '✅ Verifying...' : '✅ Verify OTP'}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            />
            <button
              onClick={resetPassword}
              disabled={isLoading}
              className={`w-full py-3 font-bold rounded-xl transition duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isLoading ? '🔁 Resetting...' : '🔁 Reset Password'}
            </button>
          </>
        )}

        {message && (
          <p className="mt-6 text-center text-red-600 font-semibold text-lg">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-black">
          Remember your password?{' '}
          <a href="/login" className="text-indigo-500 font-semibold hover:underline">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
