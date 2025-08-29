import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRedirect = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false); // No token, stay on login
        return;
      }

      try {
        const res = await axios.get("https://find-my-recipe-backend.web.app/auth/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          navigate("/home"); // Token valid → go to home
        } else {
          setLoading(false); // Invalid token → stay on login
        }
      } catch (error) {
        setLoading(false); // Error → stay on login
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return children; // Show login page
};

export default AuthRedirect;
