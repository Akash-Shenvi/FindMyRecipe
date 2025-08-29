// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        // 🔥 Replace with your backend token verify endpoint
        await axios.get("https://find-my-recipe-backend.web.app/auth/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsValid(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        setIsValid(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
    );
  }

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
