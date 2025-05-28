// This file will be used to set up the testing environment
// Adding any global test configuration here

// Import necessary testing libraries
// Note: We're adding a comment for @testing-library/jest-dom since it's not installed yet
// import '@testing-library/jest-dom';

// Custom matchers would be defined here
// For example, a matcher to check if a button has the correct variant class

// Global test setup
beforeAll(() => {
  // Global setup - runs once before all tests
  console.log("Setting up test environment");
});

afterAll(() => {
  // Global teardown - runs once after all tests
  console.log("Tearing down test environment");
});

// Mock any browser APIs that aren't available in the test environment
// For example, window.matchMedia
if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
}
