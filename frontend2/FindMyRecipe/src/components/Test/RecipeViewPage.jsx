import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// --- Helper Component: Skeleton Loader for this page ---
const RecipeViewSkeleton = () => (
  <div className="bg-gray-50 min-h-screen">
    <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 h-[72px]"></header>
    <div className="max-w-5xl mx-auto py-10 px-4 animate-pulse">
      <div className="h-10 bg-gray-300 rounded-md w-3/4 mx-auto mb-6"></div>
      <div className="w-full h-[400px] bg-gray-300 rounded-xl shadow mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="h-8 bg-gray-300 rounded-md w-1/3"></div>
          <div className="space-y-2"><div className="h-4 bg-gray-200 rounded-md"></div><div className="h-4 bg-gray-200 rounded-md"></div><div className="h-4 bg-gray-200 rounded-md w-5/6"></div></div>
        </div>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200"><div className="h-6 bg-gray-300 rounded-md w-1/2 mb-4"></div><div className="space-y-3"><div className="h-5 bg-gray-200 rounded-md w-full"></div><div className="h-5 bg-gray-200 rounded-md w-full"></div></div></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Helper Component: Reusable Recipe Card for Recommendations ---
const RecipeCard = ({ item }) => (
    <Link to={`/recipe/${encodeURIComponent(item.name)}`} className="min-w-[250px] flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-t-xl" />
      <div className="p-3"><h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.name}</h3><p className="text-sm text-gray-600">{item.cuisine} • {item.course}</p></div>
    </Link>
);

// --- Main Recipe View Page Component ---
const RecipeViewPage = () => {
  const { name } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setRecipe(null);
    setError('');
    const source = axios.CancelToken.source();

    const fetchAllData = async () => {
      try {
        const [recipeRes, recsRes] = await Promise.all([
          axios.get(`https://find-my-recipe-backend.web.app/recipes/recipe?name=${encodeURIComponent(name)}`, { cancelToken: source.token }),
          axios.get(`https://find-my-recipe-backend.web.app/recipes/similar-recipes?name=${encodeURIComponent(name)}`, { cancelToken: source.token })
        ]);

        setRecipe(recipeRes.data);
        setRecommendations(recsRes.data.similar_recipes || []);
        setLoading(false); // **FIX**: Set loading to false on success inside the try block

      } catch (err) {
        // Only handle errors that are NOT cancellation errors
        if (!axios.isCancel(err)) {
          setError('❌ Could not load recipe.');
          setLoading(false); // **FIX**: Set loading to false on error inside the catch block
        }
      }
      // **FIX**: The 'finally' block that caused the error has been removed as it's no longer needed.
    };

    window.scrollTo(0, 0);
    fetchAllData();

    return () => {
      source.cancel();
    };
  }, [name]);
  
  // Animation Variants
  const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) return <RecipeViewSkeleton />;
  if (error) return <p className="text-center mt-20 text-red-600 font-semibold text-xl">{error}</p>;
  if (!recipe) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <style>{`.horizontal-scrollbar::-webkit-scrollbar { display: none; } .horizontal-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
       <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
             <Link to="/home" className="text-2xl font-bold text-orange-600">🍽️ FindMyRecipe</Link>
             <nav className="space-x-6 text-md font-medium text-gray-700">
                <Link to='/home' className="hover:text-orange-600">Home</Link>
                <Link to='/about' className="hover:text-orange-600">About</Link>
                <Link to='/contact' className="hover:text-orange-600">Contact</Link>
             </nav>
          </div>
      </header>
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto py-10 px-4 text-gray-800">
      <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold mb-6 text-orange-600 text-center">{recipe.name}</motion.h1>

      <motion.div variants={itemVariants} className="mb-8">
        <img src={recipe.image_url} alt={recipe.name} className="w-full h-[300px] md:h-[500px] object-cover rounded-xl shadow-lg border-4 border-white" />
      </motion.div>

      {/* ... the rest of your JSX remains the same ... */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            {recipe.description && (
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3 border-b-2 border-orange-200 pb-2">Description</h2>
                    <p className="text-gray-600 leading-relaxed text-justify">{recipe.description}</p>
                </motion.div>
            )}
             {recipe.instructions && (
                <motion.div variants={itemVariants} className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">Instructions</h2>
                    <ol className="space-y-4 text-gray-700">
                        {recipe.instructions.split(/\d+\.\s+/).filter(step => step.trim()).map((step, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold mr-4 flex-shrink-0">{idx + 1}</span>
                            <span className="pt-1">{step.trim()}</span>
                        </li>
                        ))}
                    </ol>
                </motion.div>
            )}
        </div>
        <div className="md:col-span-1">
             <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6 border border-gray-200 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Details</h2>
                 <div className="space-y-3 text-gray-600">
                    <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                    <p><strong>Course:</strong> {recipe.course}</p>
                    <p><strong>Diet:</strong> {recipe.diet}</p>
                    <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
                </div>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4 border-t">Ingredients</h2>
                    <ul className="space-y-2">
                    {recipe.ingredients.map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                           <svg className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                           {item}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </motion.div>
        </div>
      </div>
      {recommendations.length > 0 && (
        <motion.div variants={itemVariants} className="mt-16">
          <h2 className="text-3xl font-bold mb-4 text-orange-600">You May Also Like</h2>
          <div className="flex overflow-x-auto gap-6 pb-4 horizontal-scrollbar">
            {recommendations.map((item) => <RecipeCard key={item._id || item.name} item={item} />)}
          </div>
        </motion.div>
      )}
    </motion.div>
    </div>
  );
};

export default RecipeViewPage;