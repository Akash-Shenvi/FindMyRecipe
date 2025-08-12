import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TagsInput } from 'react-tag-input-component';
import { useNavigate, Link } from 'react-router-dom';

const IngredientSearchPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('https://find-my-recipe-backend.web.app/api/ingredient-suggestions');
      setSuggestions(res.data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const handleSearch = async (e, newPage = 1) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      // Use newPage for pagination, default to 1 if not provided
      const pageToFetch = newPage || 1;
      const res = await axios.post(
        `https://find-my-recipe-backend.web.app/recipes/search-by-ingredients?limit=20&page=${pageToFetch}`,
        { ingredients }
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

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-serif flex flex-col items-center pb-24">
      <header className="w-full border-b border-gray-800 shadow-sm bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400 cursor-pointer" onClick={() => navigate('/home')}>🍽 FindMyRecipe</h1>
        </div>
      </header>

      <h1 className="text-4xl text-yellow-600 mt-10">🥕 Search by Ingredients</h1>
      <p className="text-lg text-gray-600 mt-2">Enter ingredients to discover matching recipes!</p>

      <form onSubmit={handleSearch} className="w-full max-w-2xl mt-6 px-4">
        <TagsInput
          value={ingredients}
          onChange={setIngredients}
          name="ingredients"
          placeHolder="e.g. tomato, garlic, rice"
          suggestions={suggestions}
          classNames={{
            input: "w-full py-4 px-6 text-base border border-gray-300 rounded-full bg-white",
            tag: "bg-yellow-300 text-black font-medium px-3 py-1 rounded-full mr-2 mb-2",
            tagRemoveIcon: "ml-2 cursor-pointer"
          }}
        />
        <div className="text-center mt-6">
          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-10 rounded-full text-lg">Search</button>
        </div>
      </form>

      {loading && <p className="mt-10 text-gray-500">Searching...</p>}

      {!loading && recipes.length === 0 && <p className="mt-10 text-gray-500">No recipes found.</p>}

      {!loading && recipes.length > 0 && (
        <>
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-10">
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <Link to={`/recipe/${encodeURIComponent(recipe.name)}`}>
                  <h2 className="text-xl font-semibold text-yellow-700 mb-1 hover:underline">
                    {recipe.name} 🍽
                  </h2>
                </Link>
                <p className="text-green-600 mb-1 text-sm">✅ Match Score: {(recipe.match_percent * 100).toFixed(0)}%</p>
                <p className="text-gray-700 text-sm"><strong>Ingredients:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => handleSearch(null, page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <button
              onClick={() => handleSearch(null, page + 1)}
              disabled={page * 20 >= total}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IngredientSearchPage;
