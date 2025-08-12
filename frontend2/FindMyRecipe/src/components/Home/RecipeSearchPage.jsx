import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeSearchPage = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`https://find-my-recipe-backend.web.app/api/search-by-recipe?name=${query}`);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Navbar at the Top */}
      <header className="w-full border-b border-gray-800 shadow-sm bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-yellow-400 cursor-pointer"
            onClick={() => navigate('/home')}
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

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-extrabold text-yellow-600 text-center mb-4">🥗 Search by Recipe Name</h2>
        <p className="text-lg text-gray-700 text-center mb-8">Enter a recipe name and discover delicious results!</p>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10 justify-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Paneer Butter Masala"
            className="w-full md:w-2/3 px-6 py-3 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full text-lg transition"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {loading && (
          <p className="text-center text-gray-600 text-lg">Searching...</p>
        )}

        {!loading && recipes.length === 0 && (
          <p className="text-center text-gray-600 text-lg">No recipes found. Try something else!</p>
        )}

        {!loading && recipes.length > 0 && (
          <div className="space-y-12 pb-24">
            {recipes.map((recipe) => (
              <section key={recipe._id} className="flex flex-col md:flex-row gap-6 border-b pb-6">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full md:w-64 h-48 object-cover rounded-md"
                />
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-yellow-600">{recipe.title}</h3>
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Ingredients:</span> {recipe.ingredients.join(', ')}
                  </p>
                  <a
                    href={`/recipe/${recipe._id}`}
                    className="text-yellow-500 hover:underline font-medium mt-2"
                  >
                    View Full Recipe →
                  </a>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer Fixed at Bottom */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default RecipeSearchPage;
