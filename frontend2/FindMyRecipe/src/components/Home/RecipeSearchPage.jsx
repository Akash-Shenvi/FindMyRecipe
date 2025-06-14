import React, { useState } from 'react';
import axios from 'axios';

const RecipeSearchPage = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/search-by-recipe?name=${query}`);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-6 bg-gray-100">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12 max-w-3xl w-full border-t-8 border-green-500 text-center">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">🥗 Recipe Name Finder</h1>
        <p className="text-gray-700 text-lg mb-6">Enter recipe name (e.g. Butter Chicken)</p>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by recipe name..."
            className="w-full md:w-2/3 px-6 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl text-lg transition duration-300"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-lg text-gray-600">Looking up recipes...</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold text-green-600 mb-2">{recipe.title}</h2>
                <p className="text-gray-600 text-sm mb-4">Ingredients: {recipe.ingredients.join(', ')}</p>
                <a href={`/recipe/${recipe._id}`} className="text-green-500 hover:underline text-sm font-medium">
                  View Recipe
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchPage;
