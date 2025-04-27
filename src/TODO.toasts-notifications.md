# TODO: Toasts & Notifications

## Goals

- Make notifications robust, configurable, and user-friendly.
- Avoid side effects in reducers and improve notification UX.

## Steps

1. Refactor toast logic to move side effects out of reducers.
2. Make toast limits and durations configurable via a settings file or context.
3. Optionally, integrate a library like react-hot-toast for a more robust solution.
4. Ensure accessibility for all notifications (screen reader support, ARIA live regions).
5. Test notifications for timing, stacking, and dismissal behavior.
