// This file serves as a shim to provide CommonJS compatibility in the browser
if (typeof window !== 'undefined' && typeof module === 'undefined') {
  window.module = { exports: {} };
  window.exports = window.module.exports;
  
  // Define a simple require function for CommonJS modules
  window.require = function(modulePath) {
    console.warn(`Browser require() called for: ${modulePath}`);
    // Return an empty object as fallback
    return {};
  };
} 