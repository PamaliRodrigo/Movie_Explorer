// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import AppTheme from './shared-theme/AppTheme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppTheme>
        <App />
      </AppTheme>
    </BrowserRouter>
  </StrictMode>
);