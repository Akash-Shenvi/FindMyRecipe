import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icon Components ---
// A collection of icons for a more visual experience.
const Icons = {
  Meal: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" /></svg>,
  Ingredient: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12h-8m-4 0H4m16 4H4m16-8H4" /></svg>,
  Cuisine: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 15.25a2.5 2.5 0 100-5 .5.5 0 01.5.5v4a.5.5 0 01-.5.5zM16.2 15.25a2.5 2.5 0 100-5 .5.5 0 01.5.5v4a.5.5 0 01-.5.5z" /></svg>,
  Spice: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Time: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Save: ({ saved }) => (
    <svg className={`w-5 h-5 mr-2 transition-colors duration-300 ${saved ? 'text-white' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {saved ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />}
    </svg>
  ),
  Back: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
};

// --- Child Components ---

// A clean progress bar to show user's journey.
const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// A more engaging loading screen.
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500 mb-4"></div>
    <h2 className="text-2xl font-semibold text-gray-700">Crafting Your Recipe...</h2>
    <p className="text-gray-500 mt-2">Our AI chef is working its magic!</p>
  </div>
);

// The main card for displaying questions to the user.
const QuestionCard = ({ question, value, onChange, onNext, onBack, isFirst, isLast }) => (
  <div className="w-full flex-shrink-0">
    <div className="text-center">
      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-green-100 text-green-600 rounded-full">
        {question.icon}
      </div>
      <label className="text-2xl sm:text-3xl font-semibold mb-6 block text-gray-800">
        {question.label}
      </label>
      <input
        type="text"
        name={question.name}
        placeholder={question.placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onNext()}
        className="w-full max-w-md mx-auto p-4 text-center text-lg bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
      />
    </div>
    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
      {!isFirst && (
        <button onClick={onBack} className="flex items-center justify-center text-gray-500 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300">
          <Icons.Back /> Back
        </button>
      )}
      <button onClick={onNext} className="w-full sm:w-auto bg-green-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
        {isLast ? "Generate Recipe ✨" : "Next"}
      </button>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  // Simplified and direct questions for clarity.
  const questions = [
    { name: "mealType", label: "What type of meal is it?", placeholder: "e.g., Breakfast, Lunch, Dinner", icon: <Icons.Meal /> },
    { name: "mainIngredient", label: "What's your main ingredient?", placeholder: "e.g., Chicken, Tofu, Salmon", icon: <Icons.Ingredient /> },
    { name: "cuisine", label: "Any specific cuisine?", placeholder: "e.g., Italian, Thai, Mexican", icon: <Icons.Cuisine /> },
    { name: "spiceLevel", label: "How spicy should it be?", placeholder: "e.g., Mild, Medium, Hot", icon: <Icons.Spice /> },
    { name: "timeAvailable", label: "How much time do you have?", placeholder: "e.g., 15, 30, 45 minutes", icon: <Icons.Time /> },
  ];

  // --- State Management ---
  const [step, setStep] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState({});
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // --- Event Handlers ---
  const handleChange = (e) => {
    setAnswers({ ...answers, [questions[step].name]: e.target.value });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      if (answers[questions[step].name]?.trim()) {
        setStep(step + 1);
      }
    } else {
      if (answers[questions[step].name]?.trim()) {
        generateRecipe();
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // --- API Calls ---
  const generateRecipe = async () => {
    setLoading(true);
    setRecipe(null);
    setSaved(false);
    try {
      const res = await axios.post('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-qusn', answers);
      if (res.data.status && res.data.answer) {
        setRecipe(res.data.answer);
      } else {
        console.error("Invalid AI response", res.data);
      }
    } catch (err) {
      console.error("Error generating recipe:", err);
    }
    setLoading(false);
  };

  const saveRecipe = async () => {
    if (saved) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post('https://find-my-recipe-backend.web.app/airecipe/ai-recipe-save', recipe, { headers: { Authorization: `Bearer ${token}` } });
      setSaved(true);
    } catch (err) {
      console.error("Error saving recipe:", err);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.7s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; translateY(0); } }
      `}</style>
      <div className="min-h-screen w-full bg-gray-50 p-4 flex flex-col items-center justify-center text-gray-800">
        <main className="w-full max-w-3xl mx-auto">
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 min-h-[500px] flex flex-col justify-center">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
