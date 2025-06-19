import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ENDPOINTS = {
  cuisines: '/cuisines',
  courses: '/courses',
  diets: '/diets',
};

const Recipefind = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategoryItems = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setSearch('');
    try {
      const res = await axios.get(`http://localhost:5001${CATEGORY_ENDPOINTS[category]}`);
      console.log("Backend Response:", res.data);

      // Extract based on category key (e.g., res.data.diets)
      const key = category.toLowerCase(); // 'diets', 'courses', or 'cuisines'
      const values = res.data[key];

      if (Array.isArray(values)) {
        setItems(values);
      } else {
        console.warn("Unexpected response:", res.data);
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setItems([]);
    }
    setLoading(false);
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-serif text-gray-800 flex flex-col items-center pb-24">
      {/* Header */}
      <header className="w-full border-b border-gray-800 shadow-sm bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-yellow-400 cursor-pointer"
            onClick={() => navigate('/')}
          >
            🍽️ FindMyRecipe
          </h1>
          <nav className="space-x-6 text-md font-medium text-white">
            <button onClick={() => navigate('/')} className="hover:text-yellow-400">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-yellow-400">About Us</button>
            <button onClick={() => navigate('/contact')} className="hover:text-yellow-400">Contact Us</button>
          </nav>
        </div>
      </header>

      {/* Title */}
      <div className="w-full border-b shadow-sm py-6 px-4 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-600 flex items-center gap-2">
          🍲 Choose a Category
        </h1>
      </div>

      {/* Category Buttons */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center px-6">
        {Object.keys(CATEGORY_ENDPOINTS).map((category) => (
          <button
            key={category}
            onClick={() => fetchCategoryItems(category)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-full shadow transition"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="mt-6 w-full max-w-md px-4">
          <input
            type="text"
            placeholder={`Search ${selectedCategory}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 px-5 border border-gray-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      )}

      {/* Loading or Results */}
      {loading ? (
        <p className="mt-10 text-lg text-gray-500">Loading {selectedCategory}...</p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-4 justify-center px-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-yellow-300 text-black font-medium px-4 py-2 rounded-full shadow cursor-pointer hover:bg-yellow-400 transition"
              >
                {item}
              </div>
            ))
          ) : selectedCategory && (
            <p className="text-gray-500 text-lg">No items found for this category.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-50 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default Recipefind;
