// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { store } from './redux/store.js'; // Assuming Redux store
import App from "./App.jsx";


import { Provider } from 'react-redux';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App /> {/* Renders App.jsx, which contains AssignmentHome */}
    </Provider>
  </StrictMode>,
);