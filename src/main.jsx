import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { InstallPromptProvider } from './context/InstallPromptContext';
import './styles/index.css';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('✅ SW registered:', reg))
      .catch((err) => console.error('❌ SW registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <InstallPromptProvider>   {/* 👈 wrap here */}
        <App />
      </InstallPromptProvider>
    </ErrorBoundary>
  </React.StrictMode>
);