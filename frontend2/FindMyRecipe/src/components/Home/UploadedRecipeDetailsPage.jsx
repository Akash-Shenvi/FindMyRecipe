import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadedRecipeDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <div className="p-8 text-center text-red-600">
        Recipe not found. Please go back to{' '}
        <button className="text-blue-500 underline" onClick={() => navigate('/uploaded-recipes')}>
          Uploaded Recipes
        </button>
        .
      </div>
    );
  }

  const ingredientList = recipe.ingredients
    .split(',')
    .map((item, index) => <li key={index} className="mb-1">{item.trim()}</li>);

  const instructionList = recipe.instructions
    .split(/[\n\r]+|\d+\.\s+/)
    .filter(step => step.trim() !== '')
    .map((step, index) => (
      <li key={index} className="mb-2 leading-relaxed">{step.trim()}</li>
    ));

  const handleEdit = () => {
  navigate(`/edit-recipe/${recipe.id}`, { state: { recipe } });
};

  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5000/recipes/api/recipes/${recipe.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Recipe deleted successfully!');
      navigate('/uploaded-recipes');
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to delete recipe.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-4xl mx-auto">
      {/* Header buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
  onClick={() => navigate('/uploaded-recipes')}
  className="inline-flex items-center bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600 transition mb-6"
>
  ← Back to Uploaded Recipes
</button>

        <div className="flex space-x-3">
          <button
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
            onClick={() => navigate('/upload')}
          >
            ⬆️ <span className="ml-1">Upload Another</span>
          </button>
          <button
            className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
            onClick={handleEdit}
          >
            📝 <span className="ml-1">Edit</span>
          </button>
          <button
            className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
            onClick={handleDelete}
          >
            🗑️ <span className="ml-1">Delete</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-yellow-700 mb-4">{recipe.title}</h1>

      {/* Image */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-xl mb-6 shadow"
        />
      )}

      {/* Metadata */}
      <div className="text-gray-700 mb-8 space-y-1">
        <p><strong>Cuisine:</strong> {recipe.cuisine || 'Not specified'}</p>
        <p><strong>Course:</strong> {recipe.course || 'Not specified'}</p>
        <p><strong>Diet:</strong> {recipe.diet || 'Not specified'}</p>
        <p><strong>Prep Time:</strong> {recipe.prep_time || 'Not specified'}</p>
      </div>

      {/* Ingredients */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-4">🧂 Ingredients</h2>
        <ul className="list-disc list-inside text-gray-800">{ingredientList}</ul>
      </div>

      {/* Instructions */}
      <div>
        <h2 className="text-2xl font-semibold text-yellow-600 mb-4">👩‍🍳 Instructions</h2>
        <ol className="list-decimal list-inside text-gray-800">{instructionList}</ol>
      </div>
    </div>
  );
};

export default UploadedRecipeDetailsPage;
