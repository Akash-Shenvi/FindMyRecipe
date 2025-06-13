import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Auth/LoginPage";
import RegistrationPage from "./components/Auth/RegistrationPage";
import Intro from "./components/Home/Intro";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage/>}/>
    </Routes>
  );
};

export default App;
