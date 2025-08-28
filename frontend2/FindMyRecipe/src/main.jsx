import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // make sure this file exists and includes Tailwind
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <ThemeProvider> 
  <App />
  </ThemeProvider>
  </BrowserRouter>
  </StrictMode>
);
