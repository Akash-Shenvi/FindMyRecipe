import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icon Components ---
const Icons = {
  Cookbook: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 6a2 2 0 012-2h5l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Spinner: () => <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-500"></div>,
  Empty: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
};

// --- Child Components ---

// A component for the empty state when no recipes are saved.
const EmptyState = () => (
  <div className="text-center p-8 md:p-16 bg-gray-50 rounded-lg">
    <Icons.Empty />
    <h3 className="text-xl font-semibold text-gray-700 mt-4">Your Cookbook is Empty</h3>
    <p className="text-gray-500 mt-2">Go create some delicious recipes, and they'll appear here!</p>
  </div>
);

// A detailed view of the selected recipe with animations.
const RecipeDetails = ({ recipe, onDeleteClick }) => (
  <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{recipe.name}</h2>
        <p className="text-sm text-gray-500 mt-1">⏱️ Prep Time: {recipe.prep_time} mins</p>
      </div>
      <button onClick={onDeleteClick} className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300">
        <Icons.Trash />
      </button>
    </div>
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Ingredients</h3>
        <ul className="space-y-2 text-gray-600">
          {recipe.ingredients.map((ing, i) => <li key={i} className="flex items-start"><span className="mr-2 mt-1.5 text-green-500 text-xs">●</span>{ing}</li>)}
        </ul>
      </div>
      <div className="lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Instructions</h3>
        <ol className="space-y-3 text-gray-600">
          {recipe.steps.map((step, i) => <li key={i} className="flex"><strong className="mr-3 font-semibold text-gray-800">{i + 1}.</strong><p>{step}</p></li>)}
        </ol>
      </div>
    </div>
  </div>
);

// Main Component for Saved Recipes Page
const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const token = localStorage.getItem('token');

  // Fetch the initial list of saved recipe titles.
  useEffect(() => {
    const fetchRecipeList = async () => {
      setLoadingList(true);
      try {
        const res = await axios.get('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-saved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status) {
          setRecipes(res.data.recipes);
        }
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchRecipeList();
  }, [token]);

  // Fetch the full details of a recipe when it's selected.
  const handleSelectRecipe = async (id) => {
    if (selectedId === id) return; // Don't re-fetch if already selected
    
    setSelectedId(id);
    setSelectedRecipe(null); // Clear previous recipe
    setLoadingDetails(true);
    try {
      const res = await axios.get(`https://find-my-recipe-backend.web.app/airecipe/ai-recipe-view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setSelectedRecipe(res.data.recipe);
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Delete a recipe from the list and server.
  const handleDeleteRecipe = async (id) => {
    try {
      const res = await axios.delete(`https://find-my-recipe-backend.web.app/airecipe/ai-recipe-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        setRecipes(prev => prev.filter(r => r.id !== id));
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; translateY(0); } }
      `}</style>
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center text-green-600 mb-2">
            <Icons.Cookbook />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">My Cookbook</h1>
          <p className="text-gray-500 mt-2">All your saved AI-generated recipes in one place.</p>
        </header>

        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recipe List Sidebar */}
          <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">Saved Recipes</h2>
            {loadingList ? (
              <div className="text-center py-8"><p className="text-gray-500">Loading...</p></div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-8"><p className="text-gray-500 text-sm">No recipes yet.</p></div>
            ) : (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                {recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <button
                      onClick={() => handleSelectRecipe(recipe.id)}
                      className={`w-full text-left flex justify-between items-center p-3 rounded-md transition-all duration-300 ${selectedId === recipe.id ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <span>{recipe.name}</span>
                      <Icons.ChevronRight />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            {loadingDetails ? (
              <div className="flex justify-center items-center h-full min-h-[400px]"><Icons.Spinner /></div>
            ) : selectedRecipe ? (
              <RecipeDetails recipe={selectedRecipe} onDeleteClick={() => handleDeleteRecipe(selectedId)} />
            ) : (
              <EmptyState />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SavedRecipes;
