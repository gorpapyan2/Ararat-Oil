import React from "react";
import ReactDOM from "react-dom/client";

// CSS imports - Load in optimal order for performance

// App component import
import App from "./App";

// Import global styles – ensures CSS is bundled and applied
import "./index.css";

// Performance optimizations
// Preload critical resources
// Removed manual preload logic – the above import guarantees
// that Vite (or the chosen bundler) handles optimal injection of
// compiled CSS with proper hashing and prioritisation.

// Error boundary for initialization errors
const AppWithErrorBoundary = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize the app with proper error handling
async function initializeApp() {
  try {
    // Global styles are already imported at module scope; no
    // additional manual preloading is required.
    
    // Try to load i18n if available (non-blocking)
    try {
      const i18nModule = await import("./i18n/i18n");
      console.log("✅ Internationalization loaded successfully");
    } catch (error) {
      console.warn("⚠️ i18n not available, continuing without internationalization:", error);
    }

    // Get root element with validation
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    // Create React root and render
    const root = ReactDOM.createRoot(rootElement);
    
    // Render with performance optimizations
    root.render(<AppWithErrorBoundary />);
    
    // Log successful initialization
    console.log("🚀 Ararat Oil Management System initialized successfully");
    
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    renderErrorFallback(error);
  }
}

// Error fallback rendering
function renderErrorFallback(error: Error | unknown) {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <div className="min-h-screen flex-center bg-background">
        <div className="card max-w-md w-full">
          <div className="card-header text-center">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-card-foreground mb-4">
              Initialization Error
            </h1>
          </div>
          <div className="card-content space-y-4">
            <p className="text-muted-foreground text-center">
              The Ararat Oil Management System failed to initialize properly.
            </p>
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                Error Details (click to expand)
              </summary>
              <div className="bg-muted p-4 rounded-md text-xs font-mono">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {error instanceof Error ? (error.stack || error.message) : String(error) || "Unknown error"}
                </pre>
              </div>
            </details>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary flex-1"
              >
                Reload Application
              </button>
              <button 
                onClick={() => window.location.href = "/"} 
                className="btn btn-secondary flex-1"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

// Performance monitoring
if (typeof window !== 'undefined') {
  // Monitor Core Web Vitals
  const observePerformance = () => {
    try {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`🎯 ${entry.name}: ${entry.startTime}ms`);
        }
      }).observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn("Performance monitoring not supported");
    }
  };
  
  // Initialize performance monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePerformance);
  } else {
    observePerformance();
  }
}

// Start the application
initializeApp();
