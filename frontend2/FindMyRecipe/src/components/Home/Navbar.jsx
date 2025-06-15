import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../../assets/profile.png'; // ✅ Adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="w-full bg-black bg-opacity-60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        <h1
          onClick={() => navigate('/')}
          className="text-xl font-bold text-yellow-400 cursor-pointer"
        >
          🍽️ FindMyRecipe
        </h1>

        <nav className="flex items-center space-x-6 text-md font-medium">
          <button onClick={() => navigate('/')} className="hover:text-yellow-300">
            Home
          </button>
          <button onClick={() => navigate('/about')} className="hover:text-yellow-300">
            About Us
          </button>
          <button onClick={() => navigate('/contact')} className="hover:text-yellow-300">
            Contact Us
          </button>

          {/* ✅ Profile Picture and Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profileImage}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border-2 border-yellow-400 cursor-pointer"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg py-4 px-5 z-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold text-lg">Rani Kini</p>
                    <p className="text-sm text-gray-500">rani@example.com</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left text-sm hover:bg-yellow-100 px-3 py-2 rounded-md"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
