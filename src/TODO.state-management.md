# TODO: State Management

## Goals

- Introduce a scalable global state management solution (e.g., Zustand, Redux Toolkit).
- Refactor repeated or global state (e.g., user session, modals, toasts) into global stores.
- Remove prop drilling and duplicate state logic.

## Steps

1. Add Zustand (or chosen state manager) to the project dependencies.
2. Create global stores for user session, modals, and toasts.
3. Refactor components and hooks to use the new global stores.
4. Remove unnecessary prop drilling and duplicate state logic.
5. Test state management across the app for consistency and performance.
