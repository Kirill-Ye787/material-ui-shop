import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import App from './App.jsx';
import './styles/tailwind.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><AppThemeProvider><ShopProvider><App /></ShopProvider></AppThemeProvider></BrowserRouter></StrictMode>,
);
