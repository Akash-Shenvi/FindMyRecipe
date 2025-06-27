import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IngredientSearchPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/recipes/ingredients')
      .then(res => setSuggestions(res.data.ingredients || []))
      .catch(err => console.error('Failed to fetch suggestions:', err));
  }, []);

  // 🔍 Handle ingredient input filtering
  useEffect(() => {
    if (input.trim() === '') {
      setFilteredSuggestions([]);
    } else {
      const filtered = suggestions.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) &&
        !ingredients.includes(s)
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    }
  }, [input, suggestions, ingredients]);

  const handleAddIngredient = (ing) => {
    setIngredients([...ingredients, ing]);
    setInput('');
    setFilteredSuggestions([]);
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const fetchRecipes = async (reset = false) => {
    if (!ingredients.length) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/recipes/search-by-ingredients?limit=20&page=${reset ? 1 : page}`,
        { ingredients }
      );
      const fetched = res.data.recipes || [];
      setRecipes(reset ? fetched : [...recipes, ...fetched]);
      setPage(reset ? 2 : page + 1);
      setHasMore(fetched.length === 20);
      
    } catch (err) {
      console.error('Search error:', err);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    setHasMore(false);
    setRecipes([]);
    await fetchRecipes(true);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center pb-24">
      {/* Header */}
      <header className="w-full bg-black text-white sticky top-0 z-50 shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400 cursor-pointer" onClick={() => navigate('/home')}>
            🍽️ FindMyRecipe
          </h1>
          <nav className="space-x-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-yellow-400">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-yellow-400">About</button>
            <button onClick={() => navigate('/contact')} className="hover:text-yellow-400">Contact</button>
          </nav>
        </div>
      </header>

      {/* Title */}
      <div className="text-center py-6 border-b w-full">
        <h2 className="text-3xl font-bold text-yellow-600">🧄 Search Recipes by Ingredients</h2>
        <p className="text-lg text-gray-600 mt-2">Type ingredients and click to add. Search what you can cook!</p>
      </div>

      {/* Ingredient Tag Input */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8 px-4 relative">
        <div className="flex flex-wrap gap-2 mb-2">
          {ingredients.map((ing, idx) => (
            <span
              key={idx}
              className="bg-yellow-300 text-black px-3 py-1 rounded-full cursor-pointer"
              onClick={() => handleRemoveIngredient(ing)}
            >
              {ing} ✕
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing ingredients..."
          className="w-full py-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {filteredSuggestions.length > 0 && (
          <ul className="absolute bg-white border mt-1 w-full z-10 rounded-md shadow text-sm">
            {filteredSuggestions.map((sug, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                onClick={() => handleAddIngredient(sug)}
              >
                {sug}
              </li>
            ))}
          </ul>
        )}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-10 rounded-full text-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter bar */}
      {recipes.length > 0 && (
        <div className="w-full max-w-md mt-6 px-4">
          <input
            type="text"
            placeholder="🔍 Filter results by recipe name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full py-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      )}

      {/* Recipes */}
      {loading && <p className="text-lg mt-10 text-gray-500">Loading recipes...</p>}
      {!loading && recipes.length === 0 && (
        <p className="text-lg mt-10 text-gray-500">No recipes found. Try different ingredients.</p>
      )}
      {!loading && filteredRecipes.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
          {filteredRecipes.map((recipe, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.name)}`)}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer"
            >
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-yellow-700 mb-1">{recipe.name}</h3>
              <p className="text-sm text-gray-600"><strong>Cuisine:</strong> {recipe.cuisine}</p>
              <p className="text-sm text-gray-600"><strong>Course:</strong> {recipe.course}</p>
              <p className="text-sm text-gray-600"><strong>Diet:</strong> {recipe.diet}</p>
              <p className="text-sm text-gray-600"><strong>Prep Time:</strong> {recipe.prep_time}</p>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && (
        <button
          onClick={() => fetchRecipes(false)}
          className="mt-6 mb-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-full shadow"
        >
          ⬇️ Load More
        </button>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-black/30 backdrop-blur-md text-white text-sm text-center py-4">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default IngredientSearchPage;
