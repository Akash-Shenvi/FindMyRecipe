import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';


const questions = [
  { name: "mealType", label: "What type of meal are we creating?", placeholder: "e.g., A hearty dinner" },
  { name: "mainIngredient", label: "What is the star ingredient?", placeholder: "e.g., Fresh salmon" },
  { name: "cuisine", label: "Which cuisine inspires you?", placeholder: "e.g., Japanese" },
  { name: "spiceLevel", label: "What's the desired spice level?", placeholder: "e.g., A mild kick" },
  { name: "timeAvailable", label: "Finally, how much time do you have?", placeholder: "e.g., About 45 minutes" },
];

const Airecipe = () => {
  const [phase, setPhase] = useState('collecting'); // 'collecting', 'generating', 'finished'
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  // Removed the recipeImageUrl state


  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const currentQuestionName = questions[step].name;
    const newAnswers = { ...answers, [currentQuestionName]: currentInput };
    setAnswers(newAnswers);
    setCurrentInput('');

    const nextStep = step + 1;
    if (nextStep < questions.length) {
      setStep(nextStep);
    } else {
      setPhase('generating');
      generateRecipe(newAnswers);
    }
  };

  const generateRecipe = async (finalAnswers) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const res = await axios.post('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-qusn', finalAnswers);
      if (res.data.status && res.data.answer) {
        setRecipe(res.data.answer);
        setPhase('finished');
      }
    } catch (err) {
      console.error("Error generating recipe:", err);
    }

  };

  const handleStartOver = () => {
    setPhase('collecting');
    setStep(0);
    setAnswers({});
    setRecipe(null);
    setSaved(false);
  };

  const saveRecipe = async () => { 

    const token = localStorage.getItem("token");
    if (!token || !recipe) return;
    try {

      await axios.post('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-save', recipe, {
        // FIX 1: Added backticks to create a valid template literal string
        headers: { Authorization: `Bearer ${token}` },
      });

      setSaved(true);
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert('Failed to save the recipe. Please try again.');
    }
  };

  // --- Reset Function ---
  const startOver = () => {
    setAnswers({});
    setRecipe(null);
    setLoading(false);
    setSaved(false);
    setStep(-1); // Back to welcome screen
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingScreen />;
    }
    if (recipe) {
      return (
        <div className="animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center">{recipe.name}</h2>
          <p className="mb-6 text-sm text-gray-500 text-center">⏱️ Prep Time: {recipe.prep_time} mins</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-4">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b-2 border-gray-200 pb-2">Ingredients</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                {recipe.ingredients.map((ing, i) => <li key={i} className="flex items-start"><span className="mr-2 mt-1 text-green-500">∙</span>{ing}</li>)}
              </ul>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b-2 border-gray-200 pb-2">Instructions</h3>
              <ol className="text-gray-600 space-y-3">
                {recipe.steps.map((step, i) => <li key={i} className="flex"><strong className="mr-3 font-semibold text-gray-700">{i + 1}.</strong><p>{step}</p></li>)}
              </ol>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <button onClick={saveRecipe} className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${saved ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
              <Icons.Save saved={saved} />
              {saved ? "Saved!" : "Save to Cookbook"}
            </button>
            <button onClick={startOver} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300">
              Create Another
            </button>
          </div>
        </div>
      );
    }
    if (step === -1) {
      return (
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Welcome to the AI Recipe Chef</h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Answer a few simple questions, and we'll generate a custom recipe just for you.</p>
          <button onClick={() => setStep(0)} className="mt-8 bg-green-500 text-white font-bold px-8 py-4 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-xl">
            Let's Start Cooking!
          </button>
        </div>
      );
    }
    return (
      <>
        <ProgressBar current={step} total={questions.length} />
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${step * 100}%)` }}>
            {questions.map((q, index) => (
              <QuestionCard
                key={index}
                question={q}
                value={answers[q.name] || ""}
                onChange={handleChange}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={step === 0}
                isLast={step === questions.length - 1}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  return (

    <div className="h-screen w-full bg-[#f4f1ec] flex flex-col font-serif overflow-hidden">
        <AnimatePresence mode="wait">
            {phase === 'collecting' && (
                <motion.div key="collecting" exit={{ opacity: 0 }} className="flex flex-grow w-full">
                    {/* LEFT PANEL */}
                    <div className="w-1/4 p-8 border-r border-gray-200 flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Preferences</h2>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {Object.entries(answers).map(([key, value]) => (
                                    <motion.div 
                                        key={key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <span className="font-semibold text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <p className="text-gray-800">{value}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CENTER PANEL */}
                    <div className="flex-grow flex items-center justify-center p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full max-w-xl text-center"
                            >
                                <h2 className="text-5xl font-bold text-gray-800 mb-8">{questions[step].label}</h2>
                                <form onSubmit={handleSubmitAnswer}>
                                    <input
                                        type="text"
                                        placeholder={questions[step].placeholder}
                                        value={currentInput}
                                        onChange={(e) => setCurrentInput(e.target.value)}
                                        autoFocus
                                        className="w-full text-center text-2xl p-4 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors"
                                    />
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-1/4 p-8 border-l border-gray-200 flex flex-col justify-between">
                        <div>
                         <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Status</h2>
                         <p className="text-gray-600">Awaiting input for parameter <span className="font-semibold text-orange-600">{step + 1} of {questions.length}</span>.</p>
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full">
                         <motion.div 
                            className="h-1 bg-orange-500 rounded-full"
                            initial={{ width: '0%' }}
                            // FIX 2: Added backticks to create a valid template literal string
                            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                         />
                        </div>
                    </div>
                </motion.div>
            )}

            {phase === 'generating' && (
                <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="flex flex-col items-center justify-center flex-grow">
                      <h2 className="text-5xl font-bold text-gray-800">Generating your masterpiece...</h2>
                      <p className="text-gray-500 mt-4">Our AI is consulting with culinary experts from across the digital globe.</p>
                      <div className="w-1/2 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden">
                         <motion.div 
                            className="h-1 bg-gradient-to-r from-orange-400 to-red-500"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                         />
                      </div>
                </motion.div>
            )}

            {phase === 'finished' && recipe && (
                 <motion.div 
                    key="finished" 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3, duration: 0.6 }} 
                    className="flex-grow w-full flex flex-col p-8 sm:p-12 bg-white shadow-xl rounded-lg m-4 lg:m-8 overflow-y-auto"
                >
                    {/* HEADER SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 flex-shrink-0">
                        <div className='mb-4 md:mb-0'>
                            <h1 className="text-5xl font-bold text-orange-700 leading-tight">
                                {recipe.name}
                            </h1>
                            <p className="text-gray-600 text-lg mt-3 font-medium">⏱️ Prep Time: <span className="text-orange-600">{recipe.prep_time} mins</span></p>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
                            {isLoggedIn ? ( 
                                <button 
                                    onClick={saveRecipe} 
                                    disabled={saved} 
                                    // FIX 3: Added backticks to create a valid template literal string for the classes
                                    className={`text-lg px-6 py-3 rounded-lg font-semibold transition-colors shadow-md ${saved ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                >
                                    {saved ? '✅ Saved!' : 'Save Recipe'}
                                </button> 
                            ) : ( 
                                <Link to="/login" className="text-lg bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md">
                                    Login to Save
                                </Link> 
                            )}
                            <button onClick={handleStartOver} className="text-lg bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 shadow-md">Create Another</button>
                        </div>
                    </div>

                    {/* RECIPE DETAILS */}
                    <div className="flex-grow pt-8 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="md:col-span-1"
                            >
                                 <h3 className="text-3xl font-bold text-gray-800 mb-5 border-b pb-2 border-gray-200">Ingredients</h3>
                                 <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg pl-4">
                                      {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                 </ul>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 30 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="md:col-span-2"
                            >
                                 <h3 className="text-3xl font-bold text-gray-800 mb-5 border-b pb-2 border-gray-200">Instructions</h3>
                                 <ol className="list-decimal list-inside text-gray-700 space-y-4 text-lg pl-4">
                                      {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                                 </ol>
                            </motion.div>
                        </div>
                    </div>
                 </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Airecipe;

