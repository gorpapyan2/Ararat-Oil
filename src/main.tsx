// Import module shim for CommonJS compatibility
import "./module-shim.js";

import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/i18n"; // Import i18n configuration
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { initSentry } from "./services/logger";
import { initThemeListener } from "./store/useAppStore";

// Initialize Sentry for error monitoring
initSentry();

// Initialize theme system
document.addEventListener("DOMContentLoaded", () => {
  initThemeListener();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
