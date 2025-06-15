import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TagsInput } from 'react-tag-input-component';

const UploadRecipePage = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/upload-recipe', {
        title,
        ingredients,
        instructions,
        image_url: imageUrl,
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess(true);
        setTitle('');
        setIngredients([]);
        setInstructions('');
        setImageUrl('');
      } else {
        setError('Upload failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while uploading.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 pb-28">
      {/* Navbar */}
      <header className="w-full border-b border-gray-800 shadow-sm bg-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-yellow-400 cursor-pointer"
            onClick={() => navigate('/')}
          >
            🍽️ FindMyRecipe
          </h1>
          <nav className="space-x-6 text-md font-medium text-white">
            <button onClick={() => navigate('/')} className="hover:text-yellow-400">Home</button>
            <button onClick={() => navigate('/about')} className="hover:text-yellow-400">About Us</button>
            <button onClick={() => navigate('/contact')} className="hover:text-yellow-400">Contact Us</button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="pt-28 flex flex-col items-center justify-center relative px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

        <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl px-10 py-12 max-w-3xl w-full border-t-8 border-yellow-500 text-center">
          <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">🍲 Upload Your Recipe</h1>
          <p className="text-gray-700 text-lg mb-6">Share your amazing recipe with the world!</p>

          <form onSubmit={handleUpload} className="space-y-6 text-left">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Recipe Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Ingredients</label>
              <TagsInput
                value={ingredients}
                onChange={setIngredients}
                name="ingredients"
                placeHolder="e.g. tomato, paneer"
                classNames={{
                  input: "text-base w-full py-2 px-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300",
                  tag: "bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full mr-2",
                  tagRemoveIcon: "ml-2 cursor-pointer text-yellow-600 hover:text-yellow-900"
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl text-lg transition duration-300"
            >
              Upload Recipe
            </button>
          </form>

          {success && <p className="mt-4 text-green-600 font-medium">🎉 Recipe uploaded successfully!</p>}
          {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full z-50 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
  &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
</footer>
    </div>
  );
};

export default UploadRecipePage;
