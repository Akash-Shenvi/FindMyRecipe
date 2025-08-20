import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// A simple loading spinner component you can place in the same file or import
const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
  </div>
);

const Intro = () => {
  const navigate = useNavigate();
  // State to handle loading while we check authentication
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false); // No token, stop loading and show the page
        return;
      }

      try {
        const response = await axios.get('https://find-my-recipe-backend.web.app/auth/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.authorized) {
          // User is authenticated, redirect to home
          navigate('/home');
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          setIsLoading(false); // Stop loading, show the intro page
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        window.alert('Session Expired, Please Login Again');
        localStorage.removeItem('token');
        setIsLoading(false); // Stop loading on error
      }
    };

    checkAuth();
  }, [navigate]);

  // Function for smooth scrolling
  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show spinner while checking auth
  if (isLoading) {
    return <Spinner />;
  }

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Animate children one after another
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-8 flex flex-col items-center">
      <motion.div
        className="max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4"
        >
          🍽️ Welcome to Find My Recipe
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg sm:text-xl mb-6">
          Your gateway to a wide variety of delicious Indian recipes.
        </motion.p>

        <motion.p variants={itemVariants} className="text-base sm:text-lg mb-8 text-gray-600">
          Use AI to create your own recipes, save them, and view whenever you want. Whether you're a beginner or a cooking expert — we've got something for you!
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <motion.a
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
          <motion.a
            href="#features"
            onClick={handleLearnMoreClick}
            className="border border-orange-500 text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-md font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div id="features" className="max-w-3xl mt-24 text-left w-full">
        <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          What We Offer
        </h2>
        <ul className="list-none space-y-4">
          <li className="flex items-start p-4 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mr-4">🍛</span>
            <div>
              <h3 className="font-semibold text-lg">Explore Recipes</h3>
              <p className="text-gray-600">Explore authentic Indian recipes from different regions.</p>
            </div>
          </li>
          <li className="flex items-start p-4 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mr-4">🤖</span>
            <div>
              <h3 className="font-semibold text-lg">AI Recipe Generator</h3>
              <p className="text-gray-600">Generate unique recipes using AI based on your input.</p>
            </div>
          </li>
          <li className="flex items-start p-4 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mr-4">📋</span>
            <div>
              <h3 className="font-semibold text-lg">Save Your Favorites</h3>
              <p className="text-gray-600">Save your favorite and AI-created recipes for later.</p>
            </div>
          </li>
          <li className="flex items-start p-4 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mr-4">📱</span>
            <div>
              <h3 className="font-semibold text-lg">Mobile Friendly</h3>
              <p className="text-gray-600">Our platform is fully responsive and easy to use on any device.</p>
            </div>
          </li>
        </ul>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Find My Recipe
      </footer>
    </div>
  );
};

export default Intro;