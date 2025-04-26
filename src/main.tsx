import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n/i18n' // Import i18n configuration
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
