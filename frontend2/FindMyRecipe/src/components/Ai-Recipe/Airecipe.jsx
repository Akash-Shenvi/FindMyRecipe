import React, { useState } from 'react';
import axios from 'axios';

const questions = [
  {
    name: "mealType",
    label: "🌅 What's your meal vibe right now?",
    placeholder: "Breakfast, Brunch, Dinner, Midnight Snack...",
  },
  {
    name: "mainIngredient",
    label: "🥕 What’s the hero ingredient?",
    placeholder: "Paneer, Chicken, Potato, Tofu...",
  },
  {
    name: "spiceLevel",
    label: "🌶️ How spicy do you want it?",
    placeholder: "Mild, Medium, Fire-level...",
  },
  {
    name: "cuisine",
    label: "🌍 Craving any cuisine?",
    placeholder: "Indian, Chinese, Italian, Fusion...",
  },
  {
    name: "timeAvailable",
    label: "⏳ How much time can you spend?",
    placeholder: "15, 30, 45 minutes...",
  },
];

const Airecipe = () => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setAnswers({ ...answers, [questions[step].name]: e.target.value });
  };

  const handleNext = () => {
    if (!answers[questions[step].name]) return;
    setStep(step + 1);
  };

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe(null);
    setSaved(false);

    try {
      const res = await axios.post('http://localhost:5000/airecipe/ai-recipe-qusn', answers);
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
    const token = localStorage.getItem("token");
    try {
      await axios.post('http://localhost:5000/airecipe/ai-recipe-save', recipe, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-6 py-10 flex flex-col items-center text-gray-800">
      <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">🤖 AI Recipe Creator</h1>

      {!recipe && step < questions.length && (
        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-lg">
          <label className="text-lg font-semibold mb-2 block">
            {questions[step].label}
          </label>
          <input
            type="text"
            name={questions[step].name}
            placeholder={questions[step].placeholder}
            value={answers[questions[step].name] || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={step === questions.length - 1 ? generateRecipe : handleNext}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 w-full"
          >
            {step === questions.length - 1 ? (loading ? "Generating..." : "Generate Recipe") : "Next"}
          </button>
        </div>
      )}

      {recipe && (
        <div className="w-full max-w-3xl mt-10 bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-orange-700 mb-4">{recipe.name}</h2>
          <p className="mb-3 text-sm text-gray-500">⏱️ Prep Time: {recipe.prep_time} mins</p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">🧂 Ingredients</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">👨‍🍳 Steps</h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <button
            onClick={saveRecipe}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            {saved ? "✅ Saved" : "Save Recipe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Airecipe;
