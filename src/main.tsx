import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/i18n"; // Import i18n configuration
import App from "./App";
import "./index.css";
import ErrorBoundary from "./core/providers/ErrorBoundary";
import { initSentry } from "./services/logger";
import { initThemeListener } from "@/core/store";
import { initPerformanceMonitoring } from "./utils/performance";
import DeprecationTracker from '@/shared/components/dev/DeprecationTracker'

// Check for debug mode
const isDebugMode = import.meta.env.MODE === 'debug';
const disableStrictMode = import.meta.env.VITE_DISABLE_STRICT_MODE === 'true';

// Only initialize these in normal mode, not debug mode
if (!isDebugMode) {
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
}

// Create root element if it doesn't exist
const rootElement = document.getElementById("root") || (() => {
  const element = document.createElement('div');
  element.id = 'root';
  document.body.appendChild(element);
  return element;
})();

// Simplified render in debug mode
if (isDebugMode) {
  console.log("🔧 Running in DEBUG mode - simplified rendering");
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  // Regular render with strict mode (unless disabled)
  if (disableStrictMode) {
    console.log("⚠️ React StrictMode is disabled");
    ReactDOM.createRoot(rootElement).render(
      <>
        <DeprecationTracker />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </>
    );
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <DeprecationTracker />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  }
}
