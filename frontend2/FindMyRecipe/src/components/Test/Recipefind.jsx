import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable UI Components (for Presentation) ---

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const RecipeCard = ({ recipe, navigate }) => (
  <motion.div 
    variants={cardVariants} 
    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm group hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.name)}`)}
  >
    <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover" />
    <div className="p-5">
      <h3 className="text-xl font-bold text-orange-600 truncate group-hover:text-orange-500">{recipe.name}</h3>
      <p className="text-gray-600 text-sm mt-2"><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p className="text-gray-500 text-sm"><strong>Prep Time:</strong> {recipe.prep_time}</p>
    </div>
  </motion.div>
);

const RecipeCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"><div className="w-full h-48 bg-gray-200 animate-pulse"></div><div className="p-5"><div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div><div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse"></div><div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse mt-2"></div></div></div>
);

const FilterSidebar = ({ options, filters, searchInputs, onFilterSelect, onSearchChange, onClearFilter, isOpen, setIsOpen }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-600">Filters</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
            {Object.keys(options).map(type => (
              <div key={type} className="mb-6">
                <h3 className="font-semibold text-gray-800 capitalize mb-3">{type}</h3>
                <input type="text" placeholder={`Search ${type}...`} value={searchInputs[type]} onChange={(e) => onSearchChange(type, e.target.value)} className="w-full mb-3 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {options[type].filter(o => o.toLowerCase().includes(searchInputs[type].toLowerCase())).map(item => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-orange-600">
                      <input type="checkbox" checked={filters[type].includes(item)} onChange={() => onFilterSelect(type, item)} className="w-4 h-4 rounded bg-gray-200 border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                 <button onClick={() => onClearFilter(type)} className="text-red-500 hover:underline text-xs mt-3">Clear All</button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
     {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"></div>}
  </>
);


// --- Main RecipeFind Component ---
// Your original logic is preserved below. Only the JSX is changed.

const FILTER_CATEGORIES = {
  cuisine: '/recipes/cuisines',
  course: '/recipes/courses',
  diet: '/recipes/diets',
};

const RecipeFind = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- ALL STATE AND LOGIC BELOW IS YOUR ORIGINAL CODE ---
  // --- NO CHANGES WERE MADE TO THE CONNECTIONS ---

  const parseQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const parsed = {};
    for (let key of Object.keys(FILTER_CATEGORIES)) {
      parsed[key] = params.getAll(key);
    }
    return parsed;
  };

  const [filters, setFilters] = useState(parseQueryParams);
  const [options, setOptions] = useState({ cuisine: [], course: [], diet: [] });
  const [searchInputs, setSearchInputs] = useState({ cuisine: '', course: '', diet: '' });
  const [recipes, setRecipes] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for new UI
  const [isFetchingMore, setIsFetchingMore] = useState(false); // State for "Load More" button


  useEffect(() => {
    Object.entries(FILTER_CATEGORIES).forEach(async ([key, endpoint]) => {
      try {
        const res = await axios.get(`https://find-my-recipe-backend.web.app${endpoint}`);
        const dataKey = Object.keys(res.data)[0];
        setOptions(prev => ({ ...prev, [key]: res.data[dataKey] }));
      } catch (err) { console.error(`Failed loading ${key}:`, err); }
    });
  }, []);
  
  const fetchRecipes = useCallback(async (reset = false) => {
    if (reset) {
        setLoading(true);
        setPage(1);
    } else {
        setIsFetchingMore(true);
    }

    const currentPage = reset ? 1 : page;
    try {
      const params = new URLSearchParams({ limit: 12, page: currentPage });
      Object.entries(filters).forEach(([key, values]) => {
        values.forEach(val => params.append(key, val));
      });
      
      const query = recipeSearch.trim();
      const endpoint = query ? `/recipes/search?query=${encodeURIComponent(query)}&` : '/recipes/recipes?';
      const resultsKey = query ? 'results' : 'recipes';
      
      const res = await axios.get(`https://find-my-recipe-backend.web.app${endpoint}${params.toString()}`);
      const fetched = res.data[resultsKey] || [];

      if (reset) {
        setRecipes(fetched);
      } else {
        setRecipes(prev => [...prev, ...fetched]);
      }
      
      setPage(currentPage + 1);
      setHasMore(fetched.length === 12);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [page, filters, recipeSearch]);


  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach(v => params.append(key, v));
    });
    navigate({ search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchRecipes(true);
      updateURL(filters);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters, recipeSearch]);

  const handleFilterSelect = (type, value) => {
    setFilters(prev => {
      const updated = prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  const clearFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: [] }));
  };

  const handleSearchInputChange = (type, value) => {
    setSearchInputs(prev => ({ ...prev, [type]: value }));
  };

  // --- NEW JSX STRUCTURE CONNECTED TO YOUR ORIGINAL LOGIC ---

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
       <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
             <Link to="/home" className="text-2xl font-bold text-orange-600">🍽️ FindMyRecipe</Link>
          </div>
      </header>
      
      <FilterSidebar 
        options={options} filters={filters} searchInputs={searchInputs}
        onFilterSelect={handleFilterSelect} onSearchChange={handleSearchInputChange} onClearFilter={clearFilter}
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <button onClick={() => setIsSidebarOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
            Filters
          </button>
          <div className="relative flex-grow w-full">
            <input type="text" placeholder="🔍 Search by recipe name..." value={recipeSearch} onChange={(e) => setRecipeSearch(e.target.value)} className="w-full py-3 pl-5 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <RecipeCardSkeleton key={i} />)}
             </div>
        ) : recipes.length > 0 ? (
          <motion.div
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {recipes.map((recipe) => <RecipeCard key={recipe._id || recipe.name} recipe={recipe} navigate={navigate} />)}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-gray-500">No Recipes Found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => fetchRecipes(false)}
              disabled={isFetchingMore}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition disabled:bg-orange-300"
            >
              {isFetchingMore ? 'Loading...' : 'Load More Recipes'}
            </button>
          </div>
        )}
      </main>
      
       <footer className="w-full bg-white/80 backdrop-blur-sm text-gray-600 text-sm text-center py-4 mt-auto border-t border-gray-200">
         &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default RecipeFind;