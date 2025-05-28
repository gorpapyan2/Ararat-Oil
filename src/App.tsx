import React, { useState, useEffect } from "react";

console.log("🚀 App.tsx module loading...");

// Minimal App component to debug the blank page issue
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("✅ App useEffect running...");
    
    // Simulate initialization
    const timer = setTimeout(() => {
      console.log("✅ App initialization complete");
      setIsLoading(false);
    }, 1000);

    return () => {
      console.log("🧹 App cleanup");
      clearTimeout(timer);
    };
  }, []);

  console.log("🔄 App rendering, isLoading:", isLoading, "error:", error);

  if (error) {
    return (
      <div style={{ 
        padding: "20px", 
        color: "red", 
        fontFamily: "Arial, sans-serif",
        border: "2px solid red",
        margin: "20px",
        borderRadius: "8px"
      }}>
        <h2>Error in App Component</h2>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        padding: "40px", 
        textAlign: "center",
        fontFamily: "Arial, sans-serif" 
      }}>
        <div style={{
          display: "inline-block",
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "20px" }}>Loading...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      background: "#f5f5f5"
    }}>
      <header style={{ 
        marginBottom: "30px", 
        borderBottom: "2px solid #ddd",
        paddingBottom: "20px"
      }}>
        <h1 style={{ 
          color: "#333",
          fontSize: "2.5rem",
          margin: "0 0 10px 0"
        }}>
          ✅ React App Working!
        </h1>
        <p style={{ 
          color: "#666",
          fontSize: "1.1rem",
          margin: 0 
        }}>
          The app has loaded successfully
        </p>
      </header>

      <main>
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px"
        }}>
          <h2 style={{ color: "#333", marginTop: 0 }}>Debug Information</h2>
          <ul style={{ lineHeight: "1.6" }}>
            <li>✅ React is working</li>
            <li>✅ Component rendering</li>
            <li>✅ State management</li>
            <li>✅ useEffect hooks</li>
            <li>✅ Event handlers</li>
          </ul>
        </div>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#333", marginTop: 0 }}>Test Interactions</h3>
          <button
            onClick={() => {
              console.log("🎯 Button clicked!");
              alert("Button works! 🎉");
            }}
            style={{
              padding: "12px 24px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              marginRight: "10px"
            }}
          >
            Test Button
          </button>
          
          <button
            onClick={() => {
              console.log("🔥 Triggering test error");
              setError("This is a test error to verify error handling");
            }}
            style={{
              padding: "12px 24px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Test Error
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
