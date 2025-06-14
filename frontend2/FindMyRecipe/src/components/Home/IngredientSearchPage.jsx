import React, { useState } from 'react';
import axios from 'axios';
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
    <div className="min-h-screen flex flex-col items-center justify-center relative p-6 bg-gray-100">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12 max-w-3xl w-full border-t-8 border-indigo-500 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">🍳 Ingredient Based Recipe Finder</h1>
        <p className="text-gray-700 text-lg mb-6">Type ingredients below and press Enter</p>

        <form onSubmit={handleSearch} className="space-y-6">
          <TagsInput
            value={ingredients}
            onChange={setIngredients}
            name="ingredients"
            placeHolder="e.g. tomato, onion, paneer"
            suggestions={INGREDIENT_SUGGESTIONS}
            classNames={{
              input: "text-lg w-full py-3 px-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400",
              tag: "bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full mr-2",
              tagRemoveIcon: "ml-2 cursor-pointer text-indigo-500 hover:text-indigo-800"
            }}
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl text-lg transition duration-300"
          >
            Search Recipes
          </button>
        </form>

        {loading && <p className="text-lg text-gray-600 mt-4">Searching recipes...</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold text-indigo-600 mb-2">{recipe.title}</h2>
                <p className="text-gray-700 text-sm mb-2">Match: {(recipe.match_percent * 100).toFixed(0)}%</p>
                <p className="text-gray-600 text-sm mb-4">Ingredients: {recipe.ingredients.join(', ')}</p>
                <a href={`/recipe/${recipe._id}`} className="text-indigo-500 hover:underline text-sm font-medium">
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

export default IngredientSearchPage;
