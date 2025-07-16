import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Savedrecipes = () => {
  const [recipes, setRecipes] = useState([]); // List of {id, name}
  const [selectedId, setSelectedId] = useState(null); // Currently selected recipe ID
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Full recipe
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch list of saved recipe titles
  useEffect(() => {
    const fetchRecipeList = async () => {
      try {
        const res = await axios.get('http://localhost:5000/airecipe/ai-recipe-saved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status) setRecipes(res.data.recipes);
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeList();
  }, [token]);

  // Fetch full recipe when a title is clicked
  const fetchRecipeDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/airecipe/ai-recipe-view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setSelectedId(id);
        setSelectedRecipe(res.data.recipe);
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    }
  };

  // Delete a saved recipe
  const deleteRecipe = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/airecipe/ai-recipe-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setRecipes(recipes.filter(r => r.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setSelectedRecipe(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">📚 Saved AI Recipes</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500">No saved recipes found.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border border-orange-300 rounded-md shadow-sm">
              <div
                onClick={() => fetchRecipeDetails(recipe.id)}
                className="cursor-pointer px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold flex justify-between items-center"
              >
                <span>🍽️ {recipe.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRecipe(recipe.id);
                  }}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  🗑 Delete
                </button>
              </div>

              {selectedId === recipe.id && selectedRecipe && (
                <div className="bg-white p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">⏱️ Prep Time: {selectedRecipe.prep_time} mins</p>
                  <h4 className="font-semibold mb-1">🧂 Ingredients</h4>
                  <ul className="list-disc list-inside text-gray-700 mb-3">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                  <h4 className="font-semibold mb-1">👨‍🍳 Steps</h4>
                  <ol className="list-decimal list-inside text-gray-700">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="mb-1">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Savedrecipes;
