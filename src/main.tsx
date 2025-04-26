// Import module shim for CommonJS compatibility
import './module-shim.js';

import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n/i18n' // Import i18n configuration
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import { initSentry } from './services/logger'
import { initThemeListener } from './store/useAppStore'

// Initialize Sentry for error monitoring
initSentry();

// Initialize theme system
initThemeListener();

// Loading component while translations are being fetched
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="text-foreground animate-pulse">Loading translations...</div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)
