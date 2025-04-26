# TODO: Error Handling & Logging

## Goals
- Integrate a robust logging service (e.g., Sentry) for both frontend and backend.
- Refactor all `console.error` and error TODOs to use the logger.
- Add user-friendly error boundaries in the React app.

## Steps
1. Add Sentry (or chosen logger) to the project dependencies.
2. Initialize Sentry in the app entry point (e.g., `main.tsx`).
3. Replace all `console.error` and error TODOs in `src/services`, `src/utils`, and other folders with logger calls.
4. Implement React error boundaries to catch and display errors gracefully.
5. Test error reporting in both development and production environments. 