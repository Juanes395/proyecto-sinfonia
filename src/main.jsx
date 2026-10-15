import { createRoot } from "react-dom/client";
import { StrictMod } from "react";
import App from "./App.jsx";
import React from "react";
createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)