import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Home/Navbar';

// --- Animation Variants (for the main card) ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// --- Icons for the Circular FAB ---
const SparklesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> );
const BookmarkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> );
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> );


const HomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [isFabOpen, setIsFabOpen] = useState(false); // State for the circular menu

  useEffect(() => {
    const storedName = localStorage.getItem('profileName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const fabOptions = [
    { icon: <SparklesIcon />, label: 'Generate with AI', path: '/ai-recipe' },
    { icon: <BookmarkIcon />, label: 'Saved Recipes', path: '/saved-recipes' },
  ];

  const fabContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const fabItemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transform: `translate(${Math.cos(i * (Math.PI / 2) + (Math.PI / 2)) * 90}px, ${Math.sin(i * (Math.PI / 2) + (Math.PI / 2)) * -90}px)`,
    }),
    exit: { opacity: 0, scale: 0.5 }
  };


  return (
    <div className="min-h-screen flex flex-col relative text-white">
      {/* Background, Navbar, Main Content are unchanged */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80"
          alt="kitchen background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <Navbar />
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 text-center">
        <motion.div 
          className="bg-white/90 text-black rounded-2xl shadow-2xl px-8 sm:px-16 py-14 max-w-5xl w-full border-t-8 border-yellow-400"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-5xl font-extrabold text-yellow-500 mb-4"
            variants={itemVariants}
          >
            🧑‍🍳 Welcome to Find My Recipe
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-800 mb-8"
            variants={itemVariants}
          >
            Discover delicious recipes your way — search by ingredients, name, or share your own!
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            <button onClick={() => navigate('/search-by-ingredients')} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg">
              🍅 Ingredient-Based Search
            </button>
            <button onClick={() => navigate('/recipefind')} className="bg-white border border-yellow-500 hover:bg-yellow-100 text-black font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg">
              🔍 Search by Recipe Name
            </button>
            <button onClick={() => navigate('/upload')} className="bg-green-400 hover:bg-green-500 text-white font-semibold py-4 px-8 rounded-xl text-lg transition duration-300 shadow-lg">
              📤 Upload a Recipe
            </button>
          </motion.div>
          <motion.div 
            className="mt-10 text-gray-700 text-base"
            variants={itemVariants}
          >
            <p>Logged in as <span className="font-semibold text-yellow-500">{userName}</span>. Happy Cooking!</p>
          </motion.div>
        </motion.div>
      </main>

      {/* --- NEW: CIRCULAR FLOATING ACTION BUTTON MENU --- */}
      <div
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30"
        onMouseEnter={() => setIsFabOpen(true)}
        onMouseLeave={() => setIsFabOpen(false)}
      >
        <motion.div className="relative w-20 h-20" variants={fabContainerVariants} initial="hidden" animate={isFabOpen ? "visible" : "hidden"}>
          <AnimatePresence>
            {isFabOpen &&
              fabOptions.map((option, i) => (
                <motion.div
                  key={option.path}
                  custom={i}
                  variants={fabItemVariants}
                  exit="exit"
                  className="absolute top-0 left-0 w-20 h-20 group"
                >
                  <button onClick={() => navigate(option.path)} className="w-14 h-14 bg-white text-gray-700 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-200 transition-colors absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {option.icon}
                  </button>
                   <div className="absolute right-[110%] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {option.label}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Main FAB Trigger Button (always visible) */}
        <button
          className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-transform duration-300 ease-in-out"
          aria-label="Toggle Actions Menu"
        >
          <motion.div animate={{ rotate: isFabOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
            <PlusIcon />
          </motion.div>
        </button>
      </div>

      <footer className="relative z-10 bg-black/40 backdrop-blur-md text-center py-4 text-white text-sm">
        &copy; {new Date().getFullYear()} FindMyRecipe. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;