import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Component for Input Fields ---
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <input {...props} className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
    </div>
);

// --- Helper Component for Toast-like Notifications ---
const Notification = ({ type, message }) => {
    const isSuccess = type === 'success';
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold z-50 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
        >
            {isSuccess ? '🎉' : '🔥'} {message}
        </motion.div>
    );
};

// --- Helper Components for Viewing Recipes ---
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const RecipeCard = ({ recipe, onClick }) => (
  <motion.div 
    variants={cardVariants} 
    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm group hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    onClick={onClick}
  >
    <img src={recipe.image_url} alt={recipe.title} className="w-full h-48 object-cover" />
    <div className="p-5">
      <h3 className="text-xl font-bold text-orange-600 truncate group-hover:text-orange-500">{recipe.title}</h3>
      <p className="text-gray-500 text-sm mt-2">Click to view details</p>
    </div>
  </motion.div>
);

const RecipeCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"><div className="w-full h-48 bg-gray-200 animate-pulse"></div><div className="p-5"><div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4"></div><div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse"></div></div></div>
);

const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
        <p className="text-2xl font-semibold text-gray-500">You haven't uploaded any recipes yet.</p>
        <p className="text-gray-400 mt-2">Your amazing creations will appear here once you've added them.</p>
    </motion.div>
);


// --- Main Combined Page Component ---
const UploadRecipePage = () => {
  const [activeView, setActiveView] = useState('upload'); 

  // State for UPLOAD FORM
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', cuisine: '', course: '', diet: '', prepTime: '', ingredients: [], instructions: '', imageUrl: '' });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });
  
  // State for VIEWING RECIPES
  const [myRecipes, setMyRecipes] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const navigate = useNavigate();

  const fetchMyRecipes = async () => {
    setListLoading(true);
    try {
      const res = await axios.get("https://find-my-recipe-backend.web.app/recipes/api/recipes");
      setMyRecipes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  // Functions for UPLOAD FORM
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleIngredientsChange = (newValue) => setFormData(prev => ({ ...prev, ingredients: newValue || [] }));
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    const ingredientsString = formData.ingredients.map(ing => ing.value).join(', ');
    try {
      const res = await axios.post( "https://find-my-recipe-backend.web.app/recipes/api/upload-recipe", {
          title: formData.title, ingredients: ingredientsString, instructions: formData.instructions,
          image_url: formData.imageUrl, cuisine: formData.cuisine, course: formData.course,
          diet: formData.diet, prep_time: formData.prepTime,
        }, { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 201 || res.status === 200) {
        setStatus({ loading: false, success: 'Recipe uploaded successfully!', error: '' });
        setTimeout(() => {
          fetchMyRecipes(); // Refresh the list of recipes
          setActiveView('view'); // Switch to the view tab
          setStatus({ loading: false, success: '', error: '' });
          // Reset the form for the next upload
          setFormData({ title: '', cuisine: '', course: '', diet: '', prepTime: '', ingredients: [], instructions: '', imageUrl: '' });
          setStep(1);
        }, 1500);
      } else {
        setStatus({ loading: false, success: '', error: 'Upload failed. Please try again.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: '', error: 'An error occurred. Please check your inputs.' });
    }
  };
  
  // Function for VIEWING RECIPES
  const handleCardClick = (recipe) => {
    navigate(`/uploaded-recipes/${recipe.id}`, { state: { recipe } });
  };
  
  const formVariants = {
    hidden: { opacity: 0, x: '50%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, x: '-50%', transition: { duration: 0.5, ease: 'easeInOut' } },
  };
  
  const selectStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', borderColor: '#D1D5DB', minHeight: '48px', boxShadow: 'none', '&:hover': { borderColor: '#F97316' } }),
    input: (styles) => ({ ...styles, color: '#111827' }),
    multiValue: (styles) => ({ ...styles, backgroundColor: '#FDBA74', borderRadius: '9999px' }),
    multiValueLabel: (styles) => ({ ...styles, color: '#7C2D12', fontWeight: '500', paddingLeft: '0.75rem' }),
    multiValueRemove: (styles) => ({ ...styles, color: '#7C2D12', ':hover': { backgroundColor: '#F97316', color: 'white' } }),
    option: (styles, { isFocused, isSelected }) => ({ ...styles, backgroundColor: isSelected ? '#FB923C' : isFocused ? '#FED7AA' : 'white', color: isSelected ? 'white' : '#111827' }),
    menu: (styles) => ({ ...styles, backgroundColor: 'white' }),
    placeholder: (styles) => ({...styles, color: '#6B7280'})
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
       <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
             <Link to="/home" className="text-2xl font-bold text-orange-600">🍽️ FindMyRecipe</Link>
          </div>
       </header>

        <main className="max-w-5xl mx-auto py-12 px-4 w-full">
            <div className="mb-8 flex justify-center border-b border-gray-200">
                <button
                    onClick={() => setActiveView('upload')}
                    className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${activeView === 'upload' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    Upload New Recipe
                </button>
                <button
                    onClick={() => setActiveView('view')}
                    className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 relative ${activeView === 'view' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    View My Recipes
                    <span className="absolute top-2 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{myRecipes.length}</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'upload' && (
                    <motion.div
                        key="upload-view"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto">
                           <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-orange-600 mb-2">Create a New Recipe</h1>
                                <p className="text-gray-600">Fill in the details below to add your recipe.</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                                <motion.div className="bg-orange-500 h-2.5 rounded-full" initial={{ width: '0%' }} animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.5 }} />
                            </div>
                            <form onSubmit={handleUpload} className="overflow-hidden relative min-h-[420px]">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full space-y-6">
                                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Step 1: Basic Info</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><InputField label="Recipe Title" name="title" value={formData.title} onChange={handleChange} required /><InputField label="Cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="e.g. Indian" /><InputField label="Course" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. Main Course" /><InputField label="Diet" name="diet" value={formData.diet} onChange={handleChange} placeholder="e.g. Vegetarian" /><InputField label="Prep Time" name="prepTime" value={formData.prepTime} onChange={handleChange} placeholder="e.g. 40 minutes" /></div>
                                        </motion.div>
                                    )}
                                    {step === 2 && (
                                        <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full space-y-6">
                                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Step 2: Recipe Details</h2>
                                            <div><label className="block text-gray-700 font-medium mb-2">Ingredients</label><CreatableSelect isMulti styles={selectStyles} value={formData.ingredients} onChange={handleIngredientsChange} placeholder="Type an ingredient and press enter..." /></div>
                                            <div><label className="block text-gray-700 font-medium mb-2">Instructions</label><textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={5} required className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"></textarea></div>
                                        </motion.div>
                                    )}
                                    {step === 3 && (
                                        <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="absolute w-full space-y-6 text-center">
                                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Step 3: Finishing Touches</h2>
                                            <InputField label="Image URL" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                                            <p className="text-gray-500 mt-6">You're all set! Ready to upload?</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                            <div className="flex justify-between items-center pt-6 border-t mt-8">
                                <button type="button" onClick={prevStep} disabled={step === 1} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                {step < 3 && <button type="button" onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">Next</button>}
                                {step === 3 && (<button type="button" onClick={handleUpload} disabled={status.loading} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:bg-green-300">{status.loading ? 'Uploading...' : 'Upload Recipe'}</button>)}
                            </div>
                        </div>
                    </motion.div>
                )}
                {activeView === 'view' && (
                     <motion.div key="view-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {listLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(3)].map((_, i) => <RecipeCardSkeleton key={i} />)}
                            </div>
                        ) : myRecipes.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {myRecipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => handleCardClick(recipe)} />
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
        
        <AnimatePresence>
            {status.success && <Notification type="success" message={status.success} />}
            {status.error && <Notification type="error" message={status.error} />}
        </AnimatePresence>
    </div>
  );
};

export default UploadRecipePage;