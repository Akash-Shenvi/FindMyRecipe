import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { motion } from 'framer-motion';

// --- Reusable UI Components (for Presentation) ---

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// A modified RecipeCard to include the "Match Score"
const RecipeCard = ({ recipe }) => (
  <motion.div 
    variants={cardVariants} 
    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm group hover:shadow-xl transition-shadow duration-300"
  >
    <Link to={`/recipe/${encodeURIComponent(recipe.name)}`} className="block">
      <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold text-orange-600 truncate group-hover:text-orange-500">{recipe.name}</h3>
        <p className="text-green-600 font-semibold my-2 text-sm">✅ Match: {(recipe.match_percent * 100).toFixed(0)}%</p>
        <p className="text-gray-500 text-sm h-12 overflow-hidden">
          <strong>Ingredients:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}
        </p>
      </div>
    </Link>
  </motion.div>
);

const RecipeCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"><div className="w-full h-48 bg-gray-200 animate-pulse"></div><div className="p-5"><div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div><div className="h-5 w-1/2 bg-gray-200 rounded-md animate-pulse"></div><div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mt-2"></div></div></div>
);


// --- Main IngredientSearchPage Component ---

const IngredientSearchPage = () => {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]); // Will be an array of objects { value, label }
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false); // To show initial message vs. "no results"

  const handleSearch = async (e, newPage = 1) => {
    if (e) e.preventDefault();
    if (ingredients.length === 0) return;

    setLoading(true);
    setSearched(true);
    try {
      const pageToFetch = newPage || 1;
      // Convert ingredients from [{value, label}] to a simple string array for the API
      const ingredientValues = ingredients.map(ing => ing.value);

      const res = await axios.post(
        `https://find-my-recipe-backend.web.app/recipes/search-by-ingredients?limit=12&page=${pageToFetch}`,
        { ingredients: ingredientValues }
      );
      const fetched = res.data.recipes || [];
      setRecipes(fetched);
      setPage(pageToFetch);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  // Custom styles for react-select to match the light theme
  const selectStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', borderColor: '#D1D5DB', minHeight: '56px', boxShadow: 'none', '&:hover': { borderColor: '#F97316' } }),
    input: (styles) => ({ ...styles, color: '#111827' }),
    multiValue: (styles) => ({ ...styles, backgroundColor: '#FDBA74', borderRadius: '9999px' }),
    multiValueLabel: (styles) => ({ ...styles, color: '#7C2D12', fontWeight: '500', paddingLeft: '0.75rem' }),
    multiValueRemove: (styles) => ({ ...styles, color: '#7C2D12', ':hover': { backgroundColor: '#F97316', color: 'white' } }),
    option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? '#FB923C' : isFocused ? '#FED7AA' : 'white', color: isSelected ? 'white' : '#111827' }),
    placeholder: (styles) => ({...styles, color: '#6B7280'})
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
       <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
             <h1 onClick={() => navigate('/home')} className="text-2xl font-bold text-orange-600 cursor-pointer">🍽️ FindMyRecipe</h1>
          </div>
      </header>

      {/* Hero Section */}
      <div className="w-full bg-white text-center py-12 px-4 border-b border-gray-200">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold text-orange-600">🥕 Search by Ingredients</h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">Have some ingredients? Enter them below to find delicious recipes you can make right now!</p>
        </motion.div>
        
        <motion.form 
            onSubmit={(e) => handleSearch(e, 1)} 
            className="w-full max-w-2xl mt-8 mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
            <CreatableSelect 
                isMulti 
                value={ingredients}
                onChange={setIngredients}
                placeholder="Type ingredients you have and press enter..."
                styles={selectStyles}
            />
            <div className="text-center mt-6">
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-md hover:shadow-lg transition-all disabled:bg-orange-300" disabled={ingredients.length === 0}>
                    Search Recipes
                </button>
            </div>
        </motion.form>
      </div>

      {/* Results Section */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
        ) : recipes.length > 0 ? (
            <>
              <motion.div
                initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {recipes.map((recipe) => <RecipeCard key={recipe._id || recipe.name} recipe={recipe} />)}
              </motion.div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <button onClick={() => handleSearch(null, page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition">
                  ⬅ Prev
                </button>
                <span className="font-semibold text-gray-600">
                    Page {page} of {Math.ceil(total / 12)}
                </span>
                <button onClick={() => handleSearch(null, page + 1)} disabled={page * 12 >= total} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition">
                  Next ➡
                </button>
              </div>
            </>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold text-gray-500">
                {searched ? "No Recipes Found" : "Your culinary adventure awaits!"}
            </p>
            <p className="text-gray-400 mt-2">
                {searched ? "Try using different or fewer ingredients." : "Enter some ingredients above to get started."}
            </p>
          </div>
        )}
      </main>
      
       <footer className="w-full bg-white/80 backdrop-blur-sm text-gray-600 text-sm text-center py-4 mt-auto border-t border-gray-200">
         &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default IngredientSearchPage;