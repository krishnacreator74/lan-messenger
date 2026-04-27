import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

// =========================
// ROOT INIT
// =========================
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// =========================
// RENDER APP
// =========================
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);