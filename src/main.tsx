import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/i18n"; // Import i18n configuration
import App from "./App";
import "./index.css";
import ErrorBoundary from "./core/providers/ErrorBoundary";
import { initSentry } from "./services/logger";
import { initThemeListener } from "@/core/store";
import { initPerformanceMonitoring } from "./utils/performance";

// Initialize Sentry for error monitoring
initSentry();

// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize theme system
initThemeListener();

// Set default language to Armenian if not set
if (!localStorage.getItem("i18nextLng")) {
  localStorage.setItem("i18nextLng", "hy");
}

// Create root element if it doesn't exist
const rootElement = document.getElementById("root") || (() => {
  const element = document.createElement('div');
  element.id = 'root';
  document.body.appendChild(element);
  return element;
})();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
