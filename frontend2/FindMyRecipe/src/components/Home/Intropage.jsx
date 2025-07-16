import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // No token, don't do anything

      try {
        const response = await axios.get('http://localhost:5000/auth/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.authorized) {
          // User is authenticated
          navigate('/home');
        }
        else{
            localStorage.removeItem('token'); 
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Optionally redirect to login if unauthorized
        // navigate('/login');
        window.alert('Session Expired, Please Login Again');
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-8 flex flex-col items-center">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4">
          🍽️ Welcome to Find My Recipe
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Your gateway to a wide variety of delicious Indian recipes.
        </p>
        <p className="text-base sm:text-lg mb-8 text-gray-600">
          Use AI to create your own recipes, save them, and view whenever you want. Whether you're a beginner or a cooking expert — we've got something for you!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="border border-orange-500 text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-md font-semibold transition"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-3xl mt-16 text-left">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">🔍 Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>🍛 Explore authentic Indian recipes from different regions</li>
          <li>🤖 Generate unique recipes using AI based on your input</li>
          <li>📋 Save your favorite and AI-created recipes</li>
          <li>📱 Mobile-friendly and easy to use</li>
        </ul>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        © 2025 Find My Recipe
      </footer>
    </div>
  );
};

export default Intro;
