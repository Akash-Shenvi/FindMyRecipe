import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TagsInput } from 'react-tag-input-component';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setIngredients(recipe.ingredients.split(',').map(i => i.trim()));
      setInstructions(recipe.instructions);
      setImageUrl(recipe.image_url || '');
    }
  }, [recipe]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://find-my-recipe-backend.web.app/recipes/api/recipes/${id}`, {
        title,
        ingredients: ingredients.join(', '),
        instructions,
        image_url: imageUrl,
      });
      alert('Recipe updated successfully!');
      navigate(`/uploaded-recipes/${id}`, {
        state: {
          recipe: {
            ...recipe,
            title,
            ingredients: ingredients.join(', '),
            instructions,
            image_url: imageUrl,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update recipe.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6">✏️ Edit Recipe</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Ingredients</label>
          <TagsInput
            value={ingredients}
            onChange={setIngredients}
            name="ingredients"
            placeHolder="e.g. tomato, rice, paneer"
            classNames={{
              input: "text-base w-full py-2 px-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300",
              tag: "bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full mr-2",
              tagRemoveIcon: "ml-2 cursor-pointer text-yellow-600 hover:text-yellow-900"
            }}
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl text-lg transition duration-300"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipePage;
