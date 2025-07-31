import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { TargetMaturityProvider } from './context/TargetMaturityContext.jsx';
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TargetMaturityProvider>
        <App />
        <Toaster position="top-right" />
      </TargetMaturityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
