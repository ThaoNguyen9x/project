import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthWrapper } from "./components/share/Context.jsx";

createRoot(document.getElementById("root")).render(
    <AuthWrapper>
      <App />
    </AuthWrapper>
);