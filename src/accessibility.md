# Accessibility Guide

This document outlines our accessibility standards and best practices for ensuring our application is usable by everyone, including people with disabilities.

## Core Principles

1. **Perceivable** - Information and UI components must be presentable to users in ways they can perceive.
2. **Operable** - UI components and navigation must be operable by all users.
3. **Understandable** - Information and UI operation must be understandable to all users.
4. **Robust** - Content must be robust enough to be interpreted by a variety of user agents and assistive technologies.

## Key Accessibility Features

Our application implements the following accessibility features:

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus order is logical and intuitive
- Focus is visually apparent with a clear outline
- Skip-to-content link allows keyboard users to bypass navigation
- Focus trapping in modals and dialogs to prevent keyboard traps

### Screen Reader Support

- Proper semantic HTML elements
- ARIA labels where necessary
- Live regions for dynamic content (toasts, alerts)
- Meaningful link text and button labels
- Alternative text for images

### Responsive Design

- Mobile-first approach
- Consistent layout across device sizes
- Unified mobile detection hook for consistent behavior

## Testing Accessibility

### Manual Testing

- Keyboard-only navigation
- Screen reader testing (NVDA, VoiceOver)
- High-contrast mode
- Text zooming to 200%
- Mobile and tablet devices

### Automated Testing

- Run Lighthouse accessibility audits
- Use axe DevTools browser extension
- Check for WCAG 2.1 AA compliance

## Implementation Patterns

### Forms and Validation

- Associate labels with inputs
- Provide error states that are announced to screen readers
- Group related fields with fieldsets and legends
- Use appropriate input types

### Modals and Dialogs

- Trap focus within the modal
- Return focus to triggering element when closed
- Use proper ARIA roles and attributes
- Provide close mechanisms via keyboard

### Notifications and Alerts

- Use appropriate `aria-live` regions
- Make notifications dismissible via keyboard
- Use appropriate timing for auto-dismissal

## Resources

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Inclusive Components](https://inclusive-components.design/) 