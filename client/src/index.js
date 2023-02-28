import React from "react";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//npm install react-router-dom
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
