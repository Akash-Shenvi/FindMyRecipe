import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Component: Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center"
                >
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="text-gray-600 my-4">{message}</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                        <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition">Confirm Delete</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Helper Component: Skeleton Loader ---
const DetailsPageSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
        <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 h-[72px]"></header>
        <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse">
            <div className="flex justify-between items-center mb-6"><div className="h-10 w-48 bg-gray-300 rounded-lg"></div><div className="flex space-x-3"><div className="h-10 w-24 bg-gray-200 rounded-lg"></div><div className="h-10 w-24 bg-gray-200 rounded-lg"></div></div></div>
            <div className="h-12 bg-gray-300 rounded-md w-3/4 mx-auto mb-6"></div>
            <div className="w-full h-[400px] bg-gray-300 rounded-xl shadow mb-8"></div>
        </div>
    </div>
);

// --- Main Component ---
const UploadedRecipeDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(location.state?.recipe || null);
  const [loading, setLoading] = useState(!recipe); // If no recipe in state, we are loading
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If we already have the recipe from navigation state, no need to fetch.
    if (recipe) {
      setLoading(false);
      return;
    }
    
    // Otherwise, fetch the recipe using the ID from the URL.
    const fetchRecipeById = async () => {
      try {
        const res = await axios.get(`https://find-my-recipe-backend.web.app/recipes/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe by ID:", err);
        setError('Could not find the requested recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeById();
  }, [id, recipe]); // Depend on ID and recipe state

  const handleEdit = () => navigate(`/edit-recipe/${recipe.id}`, { state: { recipe } });
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`https://find-my-recipe-backend.web.app/recipes/api/recipes/${recipe.id}`, {
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
      alert('Something went wrong. Please try again.');
    } finally {
        setIsModalOpen(false);
    }
  };

  if (loading) return <DetailsPageSkeleton />;
  if (error || !recipe) {
      return (
        <div className="p-8 text-center text-red-600">
            {error || 'Recipe not found.'} Go back to{' '}
            <button className="text-blue-500 underline" onClick={() => navigate('/uploaded-recipes')}>
                Uploaded Recipes
            </button>.
        </div>
      );
  }
  
  const ingredientList = recipe.ingredients.split(',').map((item, index) => <li key={index} className="flex items-center text-gray-700"><svg className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>{item.trim()}</li>);
  const instructionList = recipe.instructions.split(/[\n\r]+|\d+\.\s+/).filter(step => step.trim() !== '').map((step, index) => <li key={index} className="flex items-start"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-4 flex-shrink-0">{index + 1}</span><span className="pt-1">{step.trim()}</span></li>);

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
         <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
             <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/home" className="text-2xl font-bold text-orange-600">🍽️ FindMyRecipe</Link>
             </div>
         </header>

        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <button onClick={() => navigate('/uploaded-recipes')} className="inline-flex items-center bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                    ← Back to My Recipes
                </button>
                <div className="flex space-x-3">
                    <button onClick={handleEdit} className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold transition">
                        <span>📝</span> <span className="ml-2">Edit</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold transition">
                        <span>🗑️</span> <span className="ml-2">Delete</span>
                    </button>
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-orange-600 text-center">{recipe.title}</h1>

            <div className="mb-8">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-lg border-4 border-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">👩‍🍳 Instructions</h2>
                        <ol className="space-y-4 text-gray-700">{instructionList}</ol>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
                        <div className="space-y-3 mb-6 text-gray-600">
                            <p><strong>Cuisine:</strong> {recipe.cuisine || 'N/A'}</p>
                            <p><strong>Course:</strong> {recipe.course || 'N/A'}</p>
                            <p><strong>Diet:</strong> {recipe.diet || 'N/A'}</p>
                            <p><strong>Prep Time:</strong> {recipe.prep_time || 'N/A'}</p>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4 border-t">🧂 Ingredients</h2>
                        <ul className="space-y-2">{ingredientList}</ul>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        message="Are you sure you want to permanently delete this recipe? This action cannot be undone."
      />
    </>
  );
};

export default UploadedRecipeDetailsPage;