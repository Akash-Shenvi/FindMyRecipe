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
import ProtectedRoute from "./components/Protectedroutes";
import Protect from "./components/protect";
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
      <Route path="/" element={<Protect><Intropage/></Protect>}/>
      <Route path="/home" element={<ProtectedRoute><Intro/></ProtectedRoute>} />
      <Route path="/search-by-ingredients" element={<ProtectedRoute><IngredientSearchPage /></ProtectedRoute>} /> 
      <Route path="/search" element={<ProtectedRoute><RecipeSearchPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadRecipePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/forgot" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
      <Route path="/Recipefind" element={<ProtectedRoute><Recipefind /></ProtectedRoute>} />
      <Route path="/recipe/:name" element={<ProtectedRoute><RecipeView /></ProtectedRoute>} />
      <Route path="/uploaded-recipes" element={<ProtectedRoute><UploadedRecipesPage /></ProtectedRoute>} />
      <Route path="/uploaded-recipes/:id" element={<ProtectedRoute><UploadedRecipeDetailsPage /></ProtectedRoute>} />
      <Route path="/edit-recipe/:id" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
      <Route path="/ai-recipe" element={<ProtectedRoute><Airecipe /></ProtectedRoute>} />
      <Route path="/saved-recipes" element={<ProtectedRoute><Savedrecipes /></ProtectedRoute>} />
      <Route path="/about-us" element={<AboutUsPage />} />

    </Routes>
  );
}

export default App;
