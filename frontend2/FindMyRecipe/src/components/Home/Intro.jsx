import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-gray-100">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-30 z-0"></div>

      {/* Overlay card */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl px-12 py-16 max-w-3xl w-full border-t-8 border-indigo-500 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
          🧑‍🍳 Welcome to Find My Recipe
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Let's start cooking! Choose how you'd like to explore recipes today.
        </p>

        <div className="flex flex-col gap-6 md:flex-row md:justify-center">
          <button
            onClick={() => navigate('/ingredients')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition duration-300"
          >
            🍅 Ingredient-Based Search
          </button>
          <button
            onClick={() => navigate('/search')}
            className="bg-white border border-indigo-500 hover:bg-indigo-100 text-indigo-600 font-semibold py-4 px-8 rounded-xl text-lg transition duration-300"
          >
            🔍 Search by Recipe Name
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition duration-300"
          >
            📤 Upload a Recipe
          </button>
        </div>

        <div className="mt-10 text-gray-700 text-base">
          <p>
            Logged in as <span className="font-semibold text-indigo-600">User</span>. Happy Cooking!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
