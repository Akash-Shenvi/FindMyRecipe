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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/ingredients" element={<IngredientSearchPage />} />
      <Route path="/search" element={<RecipeSearchPage />} />
      <Route path="/upload" element={<UploadRecipePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
