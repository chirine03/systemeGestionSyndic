import React from 'react'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ← à ajouter
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App.jsx';
import { AuthProvider } from './context/AuthContex.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ← ajoute ce wrapper */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
