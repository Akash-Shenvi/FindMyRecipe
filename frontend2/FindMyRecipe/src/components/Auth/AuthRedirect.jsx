// src/components/AuthRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem('authToken'); // adjust key name as per your login logic
  return token ? <Navigate to="/intro" replace /> : children;
};

export default AuthRedirect;
