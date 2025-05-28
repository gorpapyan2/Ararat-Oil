import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Performance measurement
const startTime = performance.now();
console.log("Application starting...");

// Improved root element creation
const getRootElement = () => {
  let rootElement = document.getElementById("root");
  if (!rootElement) {
    console.log("Creating root element");
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }
  return rootElement;
};

// Global error handler for uncaught errors
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  const errorDisplay = document.createElement("div");
  errorDisplay.style.position = "fixed";
  errorDisplay.style.bottom = "0";
  errorDisplay.style.left = "0";
  errorDisplay.style.right = "0";
  errorDisplay.style.padding = "10px";
  errorDisplay.style.background = "#f8d7da";
  errorDisplay.style.color = "#721c24";
  errorDisplay.style.borderTop = "1px solid #f5c6cb";
  errorDisplay.style.zIndex = "9999";
  errorDisplay.innerHTML = `<strong>Error:</strong> ${event.error?.message || "Unknown error"}`;
  document.body.appendChild(errorDisplay);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    document.body.contains(errorDisplay) &&
      document.body.removeChild(errorDisplay);
  }, 10000);
});

// Enhanced rendering with performance tracking and error handling
try {
  const rootElement = getRootElement();
  const root = ReactDOM.createRoot(rootElement);

  // Use a simpler structure with React.StrictMode for development
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Performance logging
  const renderTime = performance.now() - startTime;
  console.log(`Initial render completed in ${renderTime.toFixed(2)}ms`);

  // Check if we actually have content rendered
  setTimeout(() => {
    const appContent = rootElement.innerHTML;
    if (appContent.trim().length < 50) {
      // A simple heuristic for "empty" app
      console.warn(
        "Application may not have rendered properly - content seems minimal"
      );
    }
  }, 2000);
} catch (error) {
  console.error("Fatal error during render:", error);

  // Fallback UI for catastrophic errors
  const rootElement = getRootElement();
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #721c24;">Application Failed to Start</h2>
      <p>There was a critical error initializing the application.</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; overflow: auto;">
        <strong>Error details:</strong>
        <pre style="margin: 10px 0 0">${error instanceof Error ? error.message : String(error)}</pre>
      </div>
      <p>Try refreshing the page or contact support if the problem persists.</p>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}
