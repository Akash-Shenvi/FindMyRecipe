import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { motion } from 'framer-motion';

// --- Helper Component for Inputs with Icons ---
const InputFieldWithIcon = ({ icon, label, ...props }) => (
    <div>
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">{icon}</span>
            </div>
            <input {...props} className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
        </div>
    </div>
);

// --- Skeleton Loader for this page ---
const EditPageSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
        <header className="w-full shadow-sm bg-white/80 h-[72px]"></header>
        <main className="max-w-6xl mx-auto py-12 px-4 animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-48 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                        <div className="h-32 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);

// --- Main Edit Page Component ---
const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ updating: false, success: '', error: '' });

  useEffect(() => {
    const recipeFromState = location.state?.recipe;
    const initializeForm = (recipe) => {
      const ingredientsForSelect = (recipe.ingredients || '')
        .split(',')
        .filter(ing => ing.trim() !== '')
        .map(ing => ({ value: ing.trim(), label: ing.trim() }));
      setFormData({ ...recipe, ingredients: ingredientsForSelect });
    };

    if (recipeFromState) {
      initializeForm(recipeFromState);
      setLoading(false);
    } else {
      const fetchRecipe = async () => {
        try {
          const res = await axios.get(`https://find-my-recipe-backend.web.app/api/recipes/${id}`);
          initializeForm(res.data);
        } catch (err) {
          setError("Could not load the recipe for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientsChange = (newValue) => {
    setFormData(prev => ({ ...prev, ingredients: newValue || [] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); 
    setStatus({ updating: true, success: '', error: '' });
    const ingredientsString = formData.ingredients.map(ing => ing.value).join(', ');
    const recipeToUpdate = {
        title: formData.title, cuisine: formData.cuisine, course: formData.course,
        diet: formData.diet, prep_time: formData.prep_time, ingredients: ingredientsString,
        instructions: formData.instructions, image_url: formData.image_url
    };

    try {
      const res = await axios.put(
        `/api/recipes/${id}`, // Using relative path for proxy
        recipeToUpdate,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 200) {
        setStatus({ updating: false, success: 'Recipe updated!', error: '' });
        const updatedRecipe = { ...formData, ingredients: ingredientsString }; // Pass updated data back
        setTimeout(() => navigate(`/uploaded-recipes/${id}`, { state: { recipe: updatedRecipe } }), 1500);
      } else {
        setStatus({ updating: false, error: 'Update failed. Please try again.' });
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'ERR_NETWORK') {
        setStatus({ updating: false, error: 'Network Error: Check backend CORS policy or proxy setup.' });
      } else {
        setStatus({ updating: false, error: 'An error occurred during the update.' });
      }
    }
  };

  const selectStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', borderColor: '#D1D5DB', paddingLeft: '2.5rem', minHeight: '52px', boxShadow: 'none', '&:hover': { borderColor: '#F97316' } }),
    // ... other styles
  };

  if (loading) return <EditPageSkeleton />;
  if (error) return <p className="text-center mt-20 text-red-500 font-semibold">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="w-full shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/home" className="text-2xl font-bold text-orange-600">🍽️ FindMyRecipe</Link>
         </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-orange-600">Edit Your Recipe</h1>
            <p className="text-lg text-gray-500 mt-1">Make changes to your recipe and save it for later.</p>
          </div>
          
          <form onSubmit={handleUpdate}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-6">
                  <InputFieldWithIcon icon="📝" label="Recipe Title" name="title" value={formData.title} onChange={handleChange} required />
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Ingredients</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><span className="text-gray-400">🧂</span></div>
                        <CreatableSelect isMulti styles={selectStyles} value={formData.ingredients} onChange={handleIngredientsChange} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Instructions</label>
                    <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={12} required className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"></textarea>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
                    <div className="space-y-4">
                      <InputFieldWithIcon icon="🌍" label="Cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange}/>
                      <InputFieldWithIcon icon="🍲" label="Course" name="course" value={formData.course} onChange={handleChange}/>
                      <InputFieldWithIcon icon="🌱" label="Diet" name="diet" value={formData.diet} onChange={handleChange}/>
                      <InputFieldWithIcon icon="⏱️" label="Prep Time" name="prep_time" value={formData.prep_time} onChange={handleChange}/>
                    </div>
                  </div>
                   <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Image</h3>
                    <InputFieldWithIcon icon="🖼️" label="Image URL" name="image_url" type="url" value={formData.image_url} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white p-4 rounded-lg shadow-md border flex justify-between items-center sticky bottom-4">
              <div className="flex-grow">
                 {status.success && <p className="text-green-600 font-semibold">{status.success}</p>}
                 {status.error && <p className="text-red-600 font-semibold text-sm">{status.error}</p>}
              </div>
              <div className="flex gap-4">
                <Link to={`/uploaded-recipes/${id}`} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition">Cancel</Link>
                <button type="submit" disabled={status.updating} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-orange-300 flex items-center">
                  {status.updating && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {status.updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditRecipePage;