import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider} from "./context/AuthContext";

//npm install react-router-dom
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </BrowserRouter>
);