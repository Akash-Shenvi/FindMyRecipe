import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Component: A Skeleton Loader for the Recipe Details (Updated for text-only) ---
const DetailSkeleton = () => (
    <div className="p-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-12"></div>
        <div className="grid grid-cols-3 gap-12">
            <div className="col-span-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
            </div>
            <div className="col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
            </div>
        </div>
    </div>
);


const Savedrecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) { setListLoading(false); return; }

      try {
        const listRes = await axios.get('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-saved', {
          // FIX: Added backticks to create a template literal string
          headers: { Authorization: `Bearer ${token}` },
        });

        if (listRes.data.status) {
          const savedList = listRes.data.recipes;
          setRecipes(savedList);
          if (savedList.length > 0) {
            fetchRecipeDetails(savedList[0].id);
          }
        }
      } catch (err) { console.error('Error fetching saved recipes:', err); }
      finally { setListLoading(false); }

    };
    fetchInitialData();
  }, [token]);


  const fetchRecipeDetails = async (id) => {
    if (!id) return;
    setDetailLoading(true);
    setSelectedId(id);

    try {
      // FIX: Added backticks to create a template literal string for the URL
      const res = await axios.get(`https://find-my-recipe-backend.web.app/airecipe/ai-recipe-view/${id}`, {
        // FIX: Added backticks here as well
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setSelectedRecipe(res.data.recipe);
      }

    } catch (err) { console.error('Error fetching recipe details:', err); }
    finally { setDetailLoading(false); }
  };

  const deleteRecipe = async (idToDelete) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        // FIX: Added backticks to create a template literal string for the URL
        await axios.delete(`https://find-my-recipe-backend.web.app/airecipe/ai-recipe-delete/${idToDelete}`, {
          // FIX: Added backticks here as well
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedRecipes = recipes.filter(r => r.id !== idToDelete);
        setRecipes(updatedRecipes);
        if (selectedId === idToDelete) {

          setSelectedRecipe(null);
          setSelectedId(null);
          if (updatedRecipes.length > 0) {
            fetchRecipeDetails(updatedRecipes[0].id);
          }
        }
      } catch (err) { console.error('Failed to delete recipe:', err); }
    }
  };

  return (

    <div className="h-screen w-full bg-[#f4f1ec] flex font-serif overflow-hidden">
        {/* LEFT PANEL: RECIPE INDEX */}
        <div className="w-1/3 max-w-sm flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800">My Recipe Box</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {listLoading ? (
                    <p className="text-center text-gray-500 p-4">Loading recipes...</p>
                ) : recipes.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">Your saved recipes will appear here.</p>
                ) : (
                    recipes.map(recipe => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * recipes.indexOf(recipe) }}
                            onClick={() => fetchRecipeDetails(recipe.id)}
                            className={`p-4 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-200 ${
                                selectedId === recipe.id ? 'bg-orange-100 shadow' : 'hover:bg-gray-100'
                            }`}
                        >
                            {/* FIX: Added backticks to create a template literal for dynamic classes */}
                            <span className={`font-semibold text-lg ${selectedId === recipe.id ? 'text-orange-700' : 'text-gray-700'}`}>
                                {recipe.name}
                            </span>
                             <button
                                onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                                className="text-gray-400 hover:text-red-500 text-xl"
                            >
                                🗑
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>

        {/* RIGHT PANEL: RECIPE VIEWER */}
        <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
                {detailLoading ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DetailSkeleton />
                    </motion.div>
                ) : selectedRecipe ? (
                    <motion.div
                        key={selectedId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-8 sm:p-12"
                    >
                        <h1 className="text-5xl font-bold text-orange-700 mb-4">{selectedRecipe.name}</h1>
                        <p className="text-gray-600 text-lg font-medium mb-8">⏱ Prep Time: <span className="text-orange-600">{selectedRecipe.prep_time} mins</span></p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 pt-8">
                            <div className="md:col-span-1">
                                <h3 className="text-3xl font-bold text-gray-800 mb-5 border-b pb-2 border-gray-200">Ingredients</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg pl-4">
                                    {selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="text-3xl font-bold text-gray-800 mb-5 border-b pb-2 border-gray-200">Instructions</h3>
                                <ol className="list-decimal list-inside text-gray-700 space-y-4 text-lg pl-4">
                                    {selectedRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500 text-xl">
                            {listLoading ? '' : 'Select a recipe to view the details.'}
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default Savedrecipes;

