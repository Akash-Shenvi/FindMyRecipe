import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Home/Navbar'; // ✅ Make sure the path is correct

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80"
          alt="kitchen background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* ✅ Reusable Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 text-center">
        <div className="bg-white/90 text-black rounded-2xl shadow-2xl px-16 py-14 max-w-5xl w-full border-t-8 border-yellow-400">
          <h2 className="text-5xl font-extrabold text-yellow-500 mb-4">
            🧑‍🍳 Welcome to Find My Recipe
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            Discover delicious recipes your way — by ingredients, name, or share your own!
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/ingredients')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg"
            >
              🍅 Ingredient-Based Search
            </button>
            <button
              onClick={() => navigate('/search')}
              className="bg-white border border-yellow-500 hover:bg-yellow-100 text-black font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg"
            >
              🔍 Search by Recipe Name
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-green-400 hover:bg-green-500 text-white font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg"
            >
              📤 Upload a Recipe
            </button>
          </div>

          <div className="mt-10 text-gray-700 text-base">
            <p>
              Logged in as <span className="font-semibold text-yellow-500">User</span>. Happy Cooking!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
