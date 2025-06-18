import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/profile.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState(defaultProfileImage);
  const [userInfo, setUserInfo] = useState({ name: 'User', email: 'user@example.com' });
  const dropdownRef = useRef();

  // Close dropdown when clicked outside
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  // Fetch profile data from localStorage
  const fetchProfileData = () => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage?.startsWith('data:image')) {
  // It's base64 (from DB)
  setProfileImg(storedImage);
} else if (storedImage && storedImage !== 'null' && storedImage !== 'undefined') {
  // It's relative path (from file system)
  setProfileImg(`http://localhost:5000/${storedImage}`);
} else {
  // No image
  setProfileImg(defaultProfileImage);
}

    const name = localStorage.getItem('profileName') || 'User';
    const email = localStorage.getItem('profileEmail') || 'user@example.com';
    setUserInfo({ name, email });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    fetchProfileData();

    // 🔄 Listen for profile update event
    window.addEventListener('profileUpdated', fetchProfileData);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('profileUpdated', fetchProfileData);
    };
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

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profileImg}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border-2 border-yellow-400 cursor-pointer object-cover"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg py-4 px-5 z-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-semibold text-lg">{userInfo.name}</p>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
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
                    onClick={() => {
                      localStorage.clear();
                      navigate('/');
                    }}
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
