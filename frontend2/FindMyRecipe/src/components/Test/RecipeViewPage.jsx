// RecipeViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeViewPage = () => {
  const { name } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recipes/recipe?name=${encodeURIComponent(name)}`);
        setRecipe(res.data);
      } catch (err) {
        setError('❌ Could not load recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();   
  }, [name]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recipes/similar-recipes?name=${encodeURIComponent(name)}`);
        setRecommendations(res.data.similar_recipes || []);
      } catch (err) {
        console.error("⚠️ Failed to load recommendations", err);
      }
    };

    fetchRecommendations();
  }, [name]);

  if (loading) return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-yellow-600 text-center">{recipe.name}</h1>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full max-h-[400px] object-cover rounded-xl shadow mb-8"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md mb-8">
        <div><strong>Cuisine:</strong> {recipe.cuisine}</div>
        <div><strong>Course:</strong> {recipe.course}</div>
        <div><strong>Diet:</strong> {recipe.diet}</div>
        <div><strong>Prep Time:</strong> {recipe.prep_time}</div>
      </div>

      {recipe.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{recipe.description}</p>
        </div>
      )}

      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-2">Ingredients</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 list-disc list-inside text-gray-700">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {recipe.instructions.split(/(?<=\.)\s+(?=[A-Z])/).map((step, idx) => (
              <li key={idx}>{step.trim()}</li>
            ))}
          </ol>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4 text-yellow-600">You May Also Like</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {recommendations.map((item, idx) => (
              <Link
                key={idx}
                to={`/recipe/${encodeURIComponent(item.name)}`}
                className="min-w-[250px] bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.cuisine} • {item.course}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.prep_time}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeViewPage;
