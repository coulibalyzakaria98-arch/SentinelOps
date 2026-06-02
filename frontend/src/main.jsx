import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import de la configuration i18n
import './index.css';

// Composant d'initialisation pour RTL
import RTLProvider from './i18n/components/RTLProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RTLProvider>
      <App />
    </RTLProvider>
  </React.StrictMode>
);
