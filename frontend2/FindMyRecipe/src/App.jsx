// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import RegistrationPage from "./components/Auth/RegistrationPage";
import Intro from "./components/Home/Intro";
import IngredientSearchPage from "./components/Home/IngredientSearchPage";
import RecipeSearchPage from "./components/Home/RecipeSearchPage";
import UploadRecipePage from "./components/Home/UploadRecipePage";
import Navbar from './components/Home/Navbar';
import ProfilePage from './components/Home/ProfilePage';
import ForgotPassword from "./components/Auth/ForgotPassword";
import Recipefind from "./components/Test/Recipefind";
import RecipeView from "./components/Test/RecipeViewPage";
import UploadedRecipesPage from './components/Home/UploadedRecipesPage';
import UploadedRecipeDetailsPage from "./components/Home/UploadedRecipeDetailsPage";
import EditRecipePage from "./components/Home/EditRecipePage";
import Airecipe from "./components/Ai-Recipe/Airecipe";
import Intropage from "./components/Home/Intropage";
import Savedrecipes from "./components/Ai-Recipe/Savedrecipe";
import AboutUsPage from "./components/Home/AboutUsPage";
function App() {
  return (
    <Routes>
      <Route
        path="/register"
        element={
          
            <RegistrationPage />
          
        }
      />
      <Route
        path="/login"
        element={
          
            <LoginPage />
         
        }
      />
      <Route path="/home" element={<Intro />} />
      <Route path="/" element={<Intropage/>}/>
      <Route path="/search-by-ingredients" element={<IngredientSearchPage />} /> 
      <Route path="/search" element={<RecipeSearchPage />} />
      <Route path="/upload" element={<UploadRecipePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/Recipefind" element={<Recipefind />} />
      <Route path="/recipe/:name" element={<RecipeView />} />
      <Route path="/uploaded-recipes" element={<UploadedRecipesPage />} />
      <Route path="/uploaded-recipes/:id" element={<UploadedRecipeDetailsPage />} />
      <Route path="/edit-recipe/:id" element={<EditRecipePage />} />
      <Route path="/ai-recipe" element={<Airecipe />} />
      <Route path="/saved-recipes" element={<Savedrecipes />} />
      <Route path="/about-us" element={<AboutUsPage />} />
    </Routes>
  );
}

export default App;
