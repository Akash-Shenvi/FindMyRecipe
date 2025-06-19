// RecipeViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeViewPage = () => {
  const { name } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/recipe?name=${encodeURIComponent(name)}`);
        setRecipe(res.data);
      } catch (err) {
        setError('❌ Could not load recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
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
        <div>
          <h2 className="text-2xl font-semibold text-yellow-500 mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {recipe.instructions.split(/(?<=\.)\s+(?=[A-Z])/).map((step, idx) => (
              <li key={idx}>{step.trim()}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RecipeViewPage;
