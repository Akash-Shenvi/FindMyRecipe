import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FILTER_CATEGORIES = {
  cuisine: '/cuisines',
  course: '/courses',
  diet: '/diets',
};

const Recipefind = () => {
  const [filters, setFilters] = useState({ cuisine: null, course: null, diet: null });
  const [options, setOptions] = useState({ cuisine: [], course: [], diet: [] });
  const [searchInputs, setSearchInputs] = useState({ cuisine: '', course: '', diet: '' });
  const [openFilter, setOpenFilter] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef();

  // Fetch filter options on mount
  useEffect(() => {
    Object.entries(FILTER_CATEGORIES).forEach(async ([key, endpoint]) => {
      try {
        const res = await axios.get(`http://localhost:5001${endpoint}`);
        const dataKey = Object.keys(res.data)[0];
        setOptions(prev => ({ ...prev, [key]: res.data[dataKey] }));
      } catch (err) {
        console.error(`Error loading ${key}:`, err);
      }
    });
  }, []);

  // Fetch recipes when filters change
  useEffect(() => {
    const { cuisine, course, diet } = filters;
    if (cuisine || course || diet) {
      fetchRecipes();
    } else {
      setRecipes([]);
    }
  }, [filters]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await axios.get(`http://localhost:5001/recipes?${params.toString()}`);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
    setLoading(false);
  };

  const toggleFilter = (type) => {
    setOpenFilter(prev => (prev === type ? null : type));
    setSearchInputs(prev => ({ ...prev, [type]: '' }));
  };

  const handleFilterSelect = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setOpenFilter(null);
  };

  const handleClearFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: null }));
    setOpenFilter(null);
  };

  const handleSearchInputChange = (type, value) => {
    setSearchInputs(prev => ({ ...prev, [type]: value }));
  };

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderFilter = (type) => {
    const filteredOptions = options[type].filter((item) =>
      item.toLowerCase().includes((searchInputs[type] || '').toLowerCase())
    );

    return (
      <div key={type} className="relative">
        <button
          onClick={() => toggleFilter(type)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-5 rounded-full shadow transition capitalize"
        >
          {filters[type] ? `${type}: ${filters[type]}` : `Select ${type}`}
        </button>

        {openFilter === type && (
          <div
            ref={popupRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto z-50"
          >
            <h2 className="text-lg font-semibold mb-3 capitalize text-yellow-600">{type} Options</h2>
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchInputs[type]}
              onChange={(e) => handleSearchInputChange(type, e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFilterSelect(type, item)}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      filters[type] === item
                        ? 'bg-yellow-400 text-black font-semibold'
                        : 'bg-gray-100 hover:bg-yellow-100 text-gray-700'
                    }`}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No options found.</p>
              )}
            </div>
            <div className="text-right">
              <button
                onClick={() => handleClearFilter(type)}
                className="text-red-500 hover:underline text-sm mr-4"
              >
                Clear selection
              </button>
              <button
                onClick={() => setOpenFilter(null)}
                className="bg-black text-white px-4 py-2 rounded-full text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(recipeSearch.toLowerCase())
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

      {/* Page Title */}
      <div className="w-full border-b shadow-sm py-6 px-4 flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-600 flex items-center gap-2">
          🍲 Filter Recipes by Category
        </h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mt-8 px-6 flex-wrap justify-center">
        {['cuisine', 'course', 'diet'].map(renderFilter)}
      </div>

      {/* Recipe title search */}
      {recipes.length > 0 && (
        <div className="mt-6 w-full max-w-md px-4">
          <input
            type="text"
            placeholder="Search recipes by title..."
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            className="w-full py-3 px-5 border border-gray-300 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      )}

      {/* Recipes */}
      {loading ? (
        <p className="text-lg mt-10 text-gray-500">Loading recipes...</p>
      ) : filteredRecipes.length > 0 ? (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-4">
          {filteredRecipes.map((recipe, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-yellow-700 mb-1">
                {recipe.name}
              </h2>
              <p className="text-gray-600 text-sm">
                Prep Time: {recipe.prep_time}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg mt-10 text-gray-500">No recipes found. Try different filters or title.</p>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-50 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default Recipefind;
