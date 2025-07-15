import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadedRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/recipes/api/recipes");
        setRecipes(res.data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleCardClick = (recipe) => {
    navigate(`/uploaded-recipes/${recipe.id}`, { state: { recipe } });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-600 mb-8 text-center">📜 Uploaded Recipes</h1>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-600">No recipes uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="cursor-pointer bg-white rounded-xl shadow-md border-t-4 border-yellow-400 overflow-hidden hover:scale-105 transition"
                onClick={() => handleCardClick(recipe)}
              >
                {recipe.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadedRecipesPage;
