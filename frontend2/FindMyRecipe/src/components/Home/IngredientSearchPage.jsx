import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';

const INGREDIENT_SUGGESTIONS = [
  "tomato", "onion", "garlic", "chicken", "paneer", "cheese", "rice",
  "potato", "spinach", "mushroom", "ginger", "carrot", "pepper", "milk",
  "cream", "chili", "turmeric", "coriander", "salt", "sugar", "oil", "butter"
];

const IngredientSearchPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/search-by-ingredients', {
        ingredients,
      });
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-serif text-gray-800 flex flex-col items-center pb-24">
      {/* Top Navbar/Header */}
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
          🥕 Search by Ingredients
        </h1>
      </div>

      <p className="mt-3 text-center text-gray-600 text-lg">
        Enter ingredients and discover delicious results!
      </p>

      {/* Form */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8 px-4">
        <TagsInput
          value={ingredients}
          onChange={setIngredients}
          name="ingredients"
          placeHolder="e.g. tomato, garlic, rice"
          suggestions={INGREDIENT_SUGGESTIONS}
          classNames={{
            input: "w-full py-4 px-6 text-base border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400",
            tag: "bg-yellow-300 text-black font-medium px-3 py-1 rounded-full mr-2 mb-2",
            tagRemoveIcon: "ml-2 cursor-pointer"
          }}
        />
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-10 rounded-full text-lg transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Result Messages */}
      {loading && (
        <p className="text-lg mt-10 text-gray-500">Searching for tasty recipes...</p>
      )}
      {!loading && recipes.length === 0 && (
        <p className="text-lg mt-10 text-gray-500">No recipes found. Try different ingredients!</p>
      )}

      {/* Recipes */}
      {!loading && recipes.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-10">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-yellow-700 mb-1">
                {recipe.title} 🍽️
              </h2>
              <p className="text-green-600 mb-1 text-sm">
                ✅ Match Score: {(recipe.match_percent * 100).toFixed(0)}%
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Ingredients:</span> {recipe.ingredients.join(', ')}
              </p>
              <a
                href={`/recipe/${recipe._id}`}
                className="text-yellow-600 hover:underline text-sm mt-2 inline-block"
              >
                View Full Recipe →
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 w-full z-50 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
  &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
</footer>
    </div>
  );
};

export default IngredientSearchPage;
