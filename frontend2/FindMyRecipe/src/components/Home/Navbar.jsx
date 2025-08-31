import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import defaultProfileImage from '../../assets/profile.png';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth dropdown animation
import ThemeToggleButton from '../common/ThemeToggleButton';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState(defaultProfileImage);
  const [userInfo, setUserInfo] = useState({ name: 'User', email: 'user@example.com' });
  const dropdownRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, skipping user fetch.");
        return;
      }

      try {
        console.log("Attempting to fetch user info...");
        const res = await axios.get('https://find-my-recipe-backend.web.app/auth/whoami', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // This log is the most important! It shows what the backend ACTUALLY sent.
        console.log("✅ API Response Received:", res.data);

        // Check if the data structure is what we expect
        if (res.data && res.data.user) {
          console.log("User data found, updating state.");
          const { name, email, image } = res.data.user;
          setUserInfo({ name, email });

          if (image?.startsWith('data:image')) {
            setProfileImg(image);
          } else if (image) {
            setProfileImg(`https://find-my-recipe-backend.web.app/${image}`);
          } else {
            setProfileImg(defaultProfileImage);
          }
        } else {
            // This will tell you if the API call worked but the data was in the wrong format.
            console.error("API response successful, but `res.data.user` is missing or empty.");
        }
      } catch (error) {
        console.error("❌ API call to fetch user info failed:", error);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    fetchUserInfo();
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We navigate to a login page, not the intro page, after logout.
    navigate('/login'); 
  };

  return (
    <header className="w-full bg-black bg-opacity-60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold text-yellow-400 cursor-pointer">
          🍽️ FindMyRecipe
        </Link>

        <nav className="flex items-center space-x-6 text-md font-medium">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/about-us" className="hover:text-yellow-300">About Us</Link>
          

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profileImg}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border-2 border-yellow-400 cursor-pointer object-cover"
            />
            <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg py-4 px-5 z-50"
              >
                <div className="flex items-center space-x-3 border-b pb-3">
                  <img src={profileImg} alt="Profile" className="w-12 h-12 rounded-full border object-cover"/>
                  <div>
                    <p className="font-semibold text-lg truncate">{userInfo.name}</p>
                    <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/profile" onClick={() => setShowDropdown(false)} className="block w-full text-left text-sm hover:bg-gray-100 px-3 py-2 rounded-md">
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md">
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
{/* <ThemeToggleButton /> */}
        </nav>
 
      </div>
    </header>
  );
};

export default Navbar;