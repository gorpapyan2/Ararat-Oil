# Testing Setup for UI Components

This document outlines the setup and structure for testing UI components in the Ararat OIL application.

## Overview

We'll use the following tools for testing:

- **Vitest**: Fast test runner that integrates well with Vite
- **@testing-library/react**: For component testing
- **@testing-library/user-event**: For simulating user interactions
- **jsdom**: For providing a DOM-like environment in Node.js

## Installation

To set up the testing environment, run the following command:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

## Configuration

Add the following to your `vite.config.ts` file:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

Create a setup file at `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

Add test scripts to your `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

## Project Structure

Tests should be organized in the following structure:

```
src/
  test/
    setup.ts
  components/
    ui/
      button.tsx
      button.test.tsx
```

Tests should be placed alongside the components they're testing, with a `.test.tsx` extension.

## Writing Tests

Here's an example of a simple test for the `Button` component:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with correct variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('destructive');
  });
});
```

## Test Coverage Goals

We aim for the following test coverage:

- **Unit tests**: Each component should have at least basic rendering and interaction tests
- **Props testing**: Test all significant props and their effects
- **Edge cases**: Test loading states, disabled states, and error handling
- **Accessibility**: Test keyboard navigation and ARIA attributes

## Standards

- Tests should be deterministic (no random behavior)
- Each test should test one thing only
- Use descriptive test names that explain what's being tested
- Mock dependencies when testing components in isolation
- Test visual appearance only when necessary; focus on behavior and structure

## Running Tests

- `npm run test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode (re-run on file changes)
- `npm run test:ui`: Run tests with UI (useful for debugging)
- `npm run test:coverage`: Generate coverage report 