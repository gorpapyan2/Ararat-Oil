import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Simple test component
function SimpleApp() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React Debug Mode</h1>
      <p>This is a simplified React application for debugging purposes.</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Testing React Rendering</h2>
        <p>If you can see this, React is rendering correctly.</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>CSS Classes Test</h2>
        <div className="bg-background p-4 rounded">
          This uses the bg-background class
        </div>
        <div className="text-primary mt-4">
          This uses the text-primary class
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>React State Test</h2>
        <StateTest />
      </div>
    </div>
  );
}

// Test component with state
function StateTest() {
  const [count, setCount] = React.useState(0);
  const [theme, setTheme] = React.useState('light');
  
  return (
    <div>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: theme === 'light' ? '#4CAF50' : '#2E7D32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Increment
      </button>
      
      <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: theme === 'light' ? '#2196F3' : '#0D47A1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Toggle Theme: {theme}
      </button>
      
      <p style={{ marginTop: '10px' }}>
        Current theme: <strong>{theme}</strong>
      </p>
    </div>
  );
}

// Create root element if it doesn't exist
const rootElement = document.getElementById("root") || (() => {
  const element = document.createElement('div');
  element.id = 'root';
  document.body.appendChild(element);
  return element;
})();

// Use a simpler render without StrictMode to avoid double rendering
ReactDOM.createRoot(rootElement).render(<SimpleApp />); 