import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../../css/app.css';

createRoot(document.getElementById('tobamarkettwin-root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
